import {isEscapeKey} from './util.js';
import {sendData} from './api.js';
import {closeEditingImageForm, onDocumentKeydown} from './form.js';

const uploadForm = document.getElementById('upload-select-image');
const editingImageForm = uploadForm.querySelector('.img-upload__overlay');
const submitFormElement = editingImageForm.querySelector('.img-upload__submit');
const successForm = document.getElementById('success').content.querySelector('.success');
const successCloseElement = successForm.querySelector('.success__button');
const errorForm = document.getElementById('error').content.querySelector('.error');
const errorCloseElement = errorForm.querySelector('.error__button');

const blockSubmitFormElement = () => {
  submitFormElement.disabled = true;
  submitFormElement.textContent = 'Публикация...';
};

const unblockSubmitFormElement = () => {
  submitFormElement.disabled = false;
  submitFormElement.textContent = 'Опубликовать';
};

const getOutsideFormClickHandler = (className, cb) => (evt) => {
  if (evt.target.closest(`.${className}`) === null) {
    cb();
  }
};

const getKeydownHandler = (cb) => (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    cb();
  }
};

const onOutsideSuccessFormClick = getOutsideFormClickHandler('success__inner', hideSuccessForm);
const onOutsideErrorFormClick = getOutsideFormClickHandler('error__inner', hideErrorForm);
const onErrorCloseElementClick = () => hideErrorForm();
const onSuccessCloseElementClick = () => hideSuccessForm();
const onSuccessFormKeydown = getKeydownHandler(hideSuccessForm);
const onErrorFormKeydown = getKeydownHandler(hideErrorForm);

function hideSuccessForm () {
  document.removeEventListener('click', onOutsideSuccessFormClick);
  document.removeEventListener('keydown', onSuccessFormKeydown);
  successCloseElement.removeEventListener('click', onSuccessCloseElementClick);
  document.body.removeChild(successForm);
}

function hideErrorForm () {
  errorCloseElement.removeEventListener('click', onErrorCloseElementClick);
  document.removeEventListener('click', onOutsideErrorFormClick);
  document.removeEventListener('keydown', onErrorFormKeydown);
  document.body.removeChild(errorForm);
  document.addEventListener('keydown', onDocumentKeydown);
  editingImageForm.classList.remove('hidden');
}

const showSuccessForm = () => {
  successCloseElement.addEventListener('click', onSuccessCloseElementClick);
  document.addEventListener('click', onOutsideSuccessFormClick);
  document.addEventListener('keydown', onSuccessFormKeydown);
  document.body.appendChild(successForm);
};

const showErrorForm = () => {
  document.removeEventListener('keydown', onDocumentKeydown);
  editingImageForm.classList.add('hidden');
  errorCloseElement.addEventListener('click', onErrorCloseElementClick);
  document.addEventListener('click', onOutsideErrorFormClick);
  document.addEventListener('keydown', onErrorFormKeydown);
  document.body.appendChild(errorForm);
};

uploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  blockSubmitFormElement();

  sendData(new FormData(evt.target))
    .then(() => {
      closeEditingImageForm();
      showSuccessForm();
    })
    .catch(showErrorForm)
    .finally(unblockSubmitFormElement);
});
