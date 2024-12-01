import {isEscapeKey} from './util.js';

const COMMENTS_NUMBER_STEP = 5;
const bigPictureElement = document.querySelector('.big-picture');
const bigPictureCloseElement = bigPictureElement.querySelector('.big-picture__cancel');
const bigPictureImage = bigPictureElement.querySelector('.big-picture__img').querySelector('img');
const bigPictureLikesCount = bigPictureElement.querySelector('.likes-count');
const bigPictureDescription = bigPictureElement.querySelector('.social__caption');
const bigPictureCommentsList = bigPictureElement.querySelector('.social__comments');
const bigPictureCommentTemplate = bigPictureCommentsList.querySelector('.social__comment');
const bigPictureCommentsLoaderElement = bigPictureElement.querySelector('.comments-loader');
const bigPictureCommentsCountElement = bigPictureElement.querySelector('.social__comment-count');

let currentPicture;
let currentCommentsIndex = 0;

const clearCommentsList = () => {
  bigPictureCommentsList.innerHTML = '';
};

const getFormatedComment = (comment) => {
  const formatedComment = bigPictureCommentTemplate.cloneNode(true);
  const commentAutorImage = formatedComment.querySelector('.social__picture');
  commentAutorImage.src = comment.avatar;
  commentAutorImage.alt = comment.name;
  formatedComment.querySelector('.social__text').textContent = comment.message;
  return formatedComment;
};

const drawComments = () => {
  let commentIndex = 0;
  for (let i = currentCommentsIndex; i < currentCommentsIndex + COMMENTS_NUMBER_STEP; i++) {
    commentIndex = i;
    bigPictureCommentsList.appendChild(getFormatedComment(currentPicture.comments[i]));
    if (i + 1 === currentPicture.comments.length) {
      bigPictureCommentsLoaderElement.classList.add('hidden');
      break;
    }
  }
  currentCommentsIndex = commentIndex + 1;
  bigPictureCommentsCountElement.innerHTML = `${currentCommentsIndex} из <span class="comments-count">${currentPicture.comments.length}</span> комментариев`;
};

const changeBigPicture = () => {
  bigPictureImage.src = currentPicture.url;
  bigPictureLikesCount.textContent = currentPicture.likes;
  bigPictureDescription.textContent = currentPicture.description;

  clearCommentsList();
  drawComments(currentPicture);
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
};

const onCloseElementClick = () => closeBigPicture();
const onCommentsLoaderElementClick = () => drawComments();

const openBigPicture = (picture) => {
  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  bigPictureCloseElement.addEventListener('click', onCloseElementClick);
  bigPictureCommentsLoaderElement.addEventListener('click', onCommentsLoaderElementClick);
  currentPicture = picture;
  changeBigPicture();
};

function closeBigPicture() {
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  bigPictureCommentsLoaderElement.classList.remove('hidden');
  document.removeEventListener('keydown', onDocumentKeydown);
  bigPictureCloseElement.removeEventListener('click', onCloseElementClick);
  bigPictureCommentsLoaderElement.removeEventListener('click', onCommentsLoaderElementClick);
  currentCommentsIndex = 0;
}

export {openBigPicture};
