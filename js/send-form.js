import {isEscapeKey} from './util.js';
import {sendData} from './api.js';
import {closeEditingImageFormElement, onDocumentKeydown} from './form.js';

const CLASS_SUCCESS_CONTAINER = 'success__inner';
const CLASS_ERROR_CONTAINER = 'error__inner';
const TEXT_SUBMIT_LOADING = 'Публикация...';
const TEXT_SUBMIT_DEFAULT = 'Опубликовать';

const uploadFormElement = document.getElementById('upload-select-image');
const editingImageFormElement = uploadFormElement.querySelector('.img-upload__overlay');
const submitFormElement = editingImageFormElement.querySelector('.img-upload__submit');
const successFormElement = document.getElementById('success').content.querySelector('.success');
const successCloseElement = successFormElement.querySelector('.success__button');
const errorFormElement = document.getElementById('error').content.querySelector('.error');
const errorCloseElement = errorFormElement.querySelector('.error__button');

const blockSubmitFormElement = () => {
  submitFormElement.disabled = true;
  submitFormElement.textContent = TEXT_SUBMIT_LOADING;
};

const unblockSubmitFormElement = () => {
  submitFormElement.disabled = false;
  submitFormElement.textContent = TEXT_SUBMIT_DEFAULT;
};

const createOnOutsideClick = (className, cb) => (evt) => {
  if (evt.target.closest(`.${className}`) === null) {
    cb();
  }
};

const createOnEscapeKeydown = (cb) => (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    cb();
  }
};

const onOutsideSuccessFormElementClick = createOnOutsideClick(CLASS_SUCCESS_CONTAINER, hideSuccessFormElement);
const onOutsideErrorFormElementClick = createOnOutsideClick(CLASS_ERROR_CONTAINER, hideErrorFormElement);
const onErrorCloseElementClick = () => hideErrorFormElement();
const onSuccessCloseElementClick = () => hideSuccessFormElement();
const onSuccessFormElementKeydown = createOnEscapeKeydown(hideSuccessFormElement);
const onErrorFormElementKeydown = createOnEscapeKeydown(hideErrorFormElement);

function hideSuccessFormElement () {
  document.removeEventListener('click', onOutsideSuccessFormElementClick);
  document.removeEventListener('keydown', onSuccessFormElementKeydown);
  successCloseElement.removeEventListener('click', onSuccessCloseElementClick);
  document.body.removeChild(successFormElement);
}

function hideErrorFormElement () {
  errorCloseElement.removeEventListener('click', onErrorCloseElementClick);
  document.removeEventListener('click', onOutsideErrorFormElementClick);
  document.removeEventListener('keydown', onErrorFormElementKeydown);
  document.body.removeChild(errorFormElement);
  document.addEventListener('keydown', onDocumentKeydown);
  editingImageFormElement.classList.remove('hidden');
}

const showSuccessFormElement = () => {
  successCloseElement.addEventListener('click', onSuccessCloseElementClick);
  document.addEventListener('click', onOutsideSuccessFormElementClick);
  document.addEventListener('keydown', onSuccessFormElementKeydown);
  document.body.appendChild(successFormElement);
};

const showErrorFormElement = () => {
  document.removeEventListener('keydown', onDocumentKeydown);
  editingImageFormElement.classList.add('hidden');
  errorCloseElement.addEventListener('click', onErrorCloseElementClick);
  document.addEventListener('click', onOutsideErrorFormElementClick);
  document.addEventListener('keydown', onErrorFormElementKeydown);
  document.body.appendChild(errorFormElement);
};

uploadFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  blockSubmitFormElement();

  sendData(new FormData(evt.target))
    .then(() => {
      closeEditingImageFormElement();
      showSuccessFormElement();
    })
    .catch(showErrorFormElement)
    .finally(unblockSubmitFormElement);
});
