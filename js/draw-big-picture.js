import {isEscapeKey} from './util.js';

const COMMENTS_NUMBER_STEP = 5;
const bigPictureElement = document.querySelector('.big-picture');
const bigPictureCloseElement = bigPictureElement.querySelector('.big-picture__cancel');
const bigPictureImage = bigPictureElement.querySelector('.big-picture__img img');
const bigPictureLikesCountElement = bigPictureElement.querySelector('.likes-count');
const bigPictureDescriptionElement = bigPictureElement.querySelector('.social__caption');
const bigPictureCommentsListElement = bigPictureElement.querySelector('.social__comments');
const bigPictureCommentTemplate = bigPictureCommentsListElement.querySelector('.social__comment');
const bigPictureCommentsLoaderElement = bigPictureElement.querySelector('.comments-loader');
const bigPictureCommentsCountElement = bigPictureElement.querySelector('.social__comment-count');

let currentPicture;
let currentCommentsIndex = 0;

const clearCommentsList = () => {
  bigPictureCommentsListElement.innerHTML = '';
};

const getCommentElement = (comment) => {
  const commentElement = bigPictureCommentTemplate.cloneNode(true);
  const commentAutorImage = commentElement.querySelector('.social__picture');
  commentAutorImage.src = comment.avatar;
  commentAutorImage.alt = comment.name;
  commentElement.querySelector('.social__text').textContent = comment.message;
  return commentElement;
};

const drawComments = () => {
  let commentIndex = 0;
  for (let i = currentCommentsIndex; i < currentCommentsIndex + COMMENTS_NUMBER_STEP; i++) {
    commentIndex = i;
    bigPictureCommentsListElement.appendChild(getCommentElement(currentPicture.comments[i]));
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
  bigPictureLikesCountElement.textContent = currentPicture.likes;
  bigPictureDescriptionElement.textContent = currentPicture.description;

  clearCommentsList();
  drawComments();
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
  currentPicture = picture;
  changeBigPicture();
  document.addEventListener('keydown', onDocumentKeydown);
  bigPictureCloseElement.addEventListener('click', onCloseElementClick);
  bigPictureCommentsLoaderElement.addEventListener('click', onCommentsLoaderElementClick);
  document.body.classList.add('modal-open');
  bigPictureElement.classList.remove('hidden');
};

function closeBigPicture () {
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  bigPictureCommentsLoaderElement.classList.remove('hidden');
  document.removeEventListener('keydown', onDocumentKeydown);
  bigPictureCloseElement.removeEventListener('click', onCloseElementClick);
  bigPictureCommentsLoaderElement.removeEventListener('click', onCommentsLoaderElementClick);
  currentCommentsIndex = 0;
}

export {openBigPicture};
