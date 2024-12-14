import {isEscapeKey} from './util.js';
import {sendData} from './api.js';
import {closeEditingImageForm, onDocumentKeydown} from './form.js';

const CLASS_SUCCESS_CONTAINER = 'success__inner';
const CLASS_ERROR_CONTAINER = 'error__inner';
const TEXT_SUBMIT_LOADING = 'Публикация...';
const TEXT_SUBMIT_DEFAULT = 'Опубликовать';

const uploadForm = document.getElementById('upload-select-image');
const editingImageForm = uploadForm.querySelector('.img-upload__overlay');
const submitFormElement = editingImageForm.querySelector('.img-upload__submit');
const successForm = document.getElementById('success').content.querySelector('.success');
const successCloseElement = successForm.querySelector('.success__button');
const errorForm = document.getElementById('error').content.querySelector('.error');
const errorCloseElement = errorForm.querySelector('.error__button');

const blockSubmitFormElement = () => {
  submitFormElement.disabled = true;
  submitFormElement.textContent = TEXT_SUBMIT_LOADING;
};

const unblockSubmitFormElement = () => {
  submitFormElement.disabled = false;
  submitFormElement.textContent = TEXT_SUBMIT_DEFAULT;
};

const createClickOutsideHandler = (className, cb) => (evt) => {
  if (evt.target.closest(`.${className}`) === null) {
    cb();
  }
};

const createEscapeKeyHandler = (cb) => (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    cb();
  }
};

const onOutsideSuccessFormClick = createClickOutsideHandler(CLASS_SUCCESS_CONTAINER, hideSuccessForm);
const onOutsideErrorFormClick = createClickOutsideHandler(CLASS_ERROR_CONTAINER, hideErrorForm);
const onErrorCloseElementClick = () => hideErrorForm();
const onSuccessCloseElementClick = () => hideSuccessForm();
const onSuccessFormKeydown = createEscapeKeyHandler(hideSuccessForm);
const onErrorFormKeydown = createEscapeKeyHandler(hideErrorForm);

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
