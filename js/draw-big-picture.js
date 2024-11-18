import {isEscapeKey} from './util.js';

const bigPictureElement = document.querySelector('.big-picture');
const bigPictureCloseElement = bigPictureElement.querySelector('.big-picture__cancel');
const bigPictureImage = bigPictureElement.querySelector('.big-picture__img').querySelector('img');
const bigPictureLikesCount = bigPictureElement.querySelector('.likes-count');
const bigPictureCommentsCount = bigPictureElement.querySelector('.comments-count');
const bigPictureDescription = bigPictureElement.querySelector('.social__caption');
const bigPictureCommentsList = bigPictureElement.querySelector('.social__comments');
const bigPictureCommentTemplate = bigPictureCommentsList.querySelector('.social__comment');

let currentPicture;

bigPictureElement.querySelector('.social__comment-count').classList.add('hidden');
bigPictureElement.querySelector('.comments-loader').classList.add('hidden');

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

const changeBigPicture = () => {
  bigPictureImage.src = currentPicture.url;
  bigPictureLikesCount.textContent = currentPicture.likes;
  bigPictureCommentsCount.textContent = currentPicture.comments.length;
  bigPictureDescription.textContent = currentPicture.description;

  clearCommentsList();
  for (let i = 0; i < currentPicture.comments.length; i++) {
    bigPictureCommentsList.appendChild(getFormatedComment(currentPicture.comments[i]));
  }
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    // eslint-disable-next-line no-use-before-define
    closeBigPicture();
  }
};

const openBigPicture = (picture) => {
  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  currentPicture = picture;
  changeBigPicture();
};

const closeBigPicture = () => {
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
};

bigPictureCloseElement.addEventListener('click', () => {
  closeBigPicture();
});

export {openBigPicture};
