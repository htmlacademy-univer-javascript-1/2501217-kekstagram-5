import {isEscapeKey} from './util.js';

const CLASS_HIDDEN = 'hidden';
const CLASS_MODAL_OPEN = 'modal-open';
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

const resetCommentsList = () => {
  bigPictureCommentsListElement.innerHTML = '';
};

const createCommentElement = (comment) => {
  const commentElement = bigPictureCommentTemplate.cloneNode(true);
  const commentAutorImage = commentElement.querySelector('.social__picture');
  commentAutorImage.src = comment.avatar;
  commentAutorImage.alt = comment.name;
  commentElement.querySelector('.social__text').textContent = comment.message;
  return commentElement;
};

const drawComments = () => {
  const commentsFragment = document.createDocumentFragment();
  const commentsToRender = currentPicture.comments.slice(currentCommentsIndex, currentCommentsIndex + COMMENTS_NUMBER_STEP);

  commentsToRender.forEach((comment) => {
    commentsFragment.appendChild(createCommentElement(comment));
  });

  bigPictureCommentsListElement.appendChild(commentsFragment);
  currentCommentsIndex += commentsToRender.length;

  if (currentCommentsIndex >= currentPicture.comments.length) {
    bigPictureCommentsLoaderElement.classList.add(CLASS_HIDDEN);
  } else {
    bigPictureCommentsLoaderElement.classList.remove(CLASS_HIDDEN);
  }

  bigPictureCommentsCountElement.innerHTML = `${currentCommentsIndex} из <span class="comments-count">${currentPicture.comments.length}</span> комментариев`;
};

const updateBigPicture = () => {
  bigPictureImage.src = currentPicture.url;
  bigPictureLikesCountElement.textContent = currentPicture.likes;
  bigPictureDescriptionElement.textContent = currentPicture.description;

  resetCommentsList();
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
  currentCommentsIndex = 0;
  updateBigPicture();
  document.addEventListener('keydown', onDocumentKeydown);
  bigPictureCloseElement.addEventListener('click', onCloseElementClick);
  bigPictureCommentsLoaderElement.addEventListener('click', onCommentsLoaderElementClick);
  document.body.classList.add(CLASS_MODAL_OPEN);
  bigPictureElement.classList.remove(CLASS_HIDDEN);
};

function closeBigPicture () {
  bigPictureElement.classList.add(CLASS_HIDDEN);
  document.body.classList.remove(CLASS_MODAL_OPEN);
  bigPictureCommentsLoaderElement.classList.remove(CLASS_HIDDEN);
  document.removeEventListener('keydown', onDocumentKeydown);
  bigPictureCloseElement.removeEventListener('click', onCloseElementClick);
  bigPictureCommentsLoaderElement.removeEventListener('click', onCommentsLoaderElementClick);
}

export {openBigPicture};
