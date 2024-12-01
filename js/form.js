import { checkRepeats, isEscapeKey } from './util.js';
import { addEventListenerToScaleElemets, removeEventListenerFromScaleElemets, addFilter, removeFilter } from './effects.js';
import { sendData } from './api.js';

const MAX_LENGTH_COMMENT = 140;
const MAX_HASHTAGS_COUNT = 5;
const re = /^#[A-Za-zА-Яа-я0-9]{1,19}$/;
const errorClass = 'upload-form__error-text';
let messageHashtagError = '';

const uploadForm = document.querySelector('.img-upload__form');
const scaleImageValueElement = uploadForm.querySelector('.scale__control--value');
const loadImgElement = uploadForm.querySelector('.img-upload__input');
const editingWindowElement = uploadForm.querySelector('.img-upload__overlay');
const closeElement = editingWindowElement.querySelector('.img-upload__cancel');
const submitElement = uploadForm.querySelector('.img-upload__submit');
const hashtagsInputElement = uploadForm.querySelector('.text__hashtags');
const descriptionInputElement = uploadForm.querySelector('.text__description');
const successForm = document.querySelector('#success').content.querySelector('.success');
const successCloseElement = successForm.querySelector('.success__button');
const errorForm = document.querySelector('#error').content.querySelector('.error');
const errorCloseElement = errorForm.querySelector('.error__button');

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: errorClass
}, true);

const validateHashtag = (hashtagString) => {
  messageHashtagError = '';
  hashtagString = hashtagString.trim().toLowerCase();
  const hashtags = hashtagString.split(/\s+/);

  if(!hashtagString) {
    return true;
  }

  for (const hashtag of hashtags) {
    if (!re.test(hashtag)) {
      messageHashtagError = 'Введён невалидный хэш-тег!';
      return false;
    }
    if (hashtags.length > MAX_HASHTAGS_COUNT) {
      messageHashtagError = `Превышено допустимое количество хэш-тегов: ${MAX_HASHTAGS_COUNT}!`;
      return false;
    }
    if (checkRepeats(hashtags)) {
      messageHashtagError = 'Хэш-теги не должны повторяться!';
      return false;
    }
  }
  return true;
};

const onFormInput = () => {
  if (pristine.validate()) {
    submitElement.disabled = false;
  } else {
    submitElement.disabled = true;
  }
};

const validateDescription = (value) => value.length <= MAX_LENGTH_COMMENT;

const getMessageHashtagError = () => messageHashtagError;

pristine.addValidator(hashtagsInputElement, validateHashtag, getMessageHashtagError);
pristine.addValidator(descriptionInputElement, validateDescription, `Длина комментария не может составлять больше ${MAX_LENGTH_COMMENT} символов`);

const getKeydownHandler = (func) => (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    func();
  }
};

const onInputElementKeydown = (evt) => evt.stopPropagation();
const onEditingWindowKeydown = getKeydownHandler(closeEditingWindow);
const onCloseElementClick = () => closeEditingWindow();

function closeEditingWindow() {
  editingWindowElement.classList.add('hidden');
  document.body.classList.remove('modal-open');

  closeElement.removeEventListener('click', onCloseElementClick);
  document.removeEventListener('keydown', onEditingWindowKeydown);
  hashtagsInputElement.removeEventListener('keydown', onInputElementKeydown);
  descriptionInputElement.removeEventListener('keydown', onInputElementKeydown);
  hashtagsInputElement.removeEventListener('input', onFormInput);
  descriptionInputElement.removeEventListener('input', onFormInput);
  removeEventListenerFromScaleElemets();
  removeFilter();

  scaleImageValueElement.value = '100%';
  hashtagsInputElement.value = '';
  descriptionInputElement.value = '';
  loadImgElement.value = '';

  const errorContainers = document.querySelectorAll(`.${errorClass}`);
  if (errorContainers) {
    errorContainers.forEach((container) => container.setAttribute('style', 'display: none;'));
  }
}

const openEditingWindow = () => {
  editingWindowElement.classList.remove('hidden');
  document.body.classList.add('modal-open');

  closeElement.addEventListener('click', onCloseElementClick);
  document.addEventListener('keydown', onEditingWindowKeydown);
  hashtagsInputElement.addEventListener('keydown', onInputElementKeydown);
  descriptionInputElement.addEventListener('keydown', onInputElementKeydown);
  hashtagsInputElement.addEventListener('input', onFormInput);
  descriptionInputElement.addEventListener('input', onFormInput);

  addEventListenerToScaleElemets();
  addFilter();
};

const onLoadImgElementChange = () => openEditingWindow();

loadImgElement.addEventListener('change', onLoadImgElementChange);

const blockSubmitElement = () => {
  submitElement.disabled = true;
  submitElement.textContent = 'Публикация...';
};

const unblockSubmitElement = () => {
  submitElement.disabled = false;
  submitElement.textContent = 'Опубликовать';
};

const getOutsideFormClickHandler = (className, func) => (evt) => {
  if (evt.target.closest(`.${className}`) === null) {
    func();
  }
};

const onOutsideSuccessFormClick = getOutsideFormClickHandler('success__inner', hideSuccessForm);
const onOutsideErrorFormClick = getOutsideFormClickHandler('error__inner', hideErrorForm);
const onErrorCloseElementClick = () => hideErrorForm();
const onSuccessCloseElementClick = () => hideSuccessForm();
const onSuccessFormKeydown = getKeydownHandler(hideSuccessForm);
const onErrorFormKeydown = getKeydownHandler(hideErrorForm);

function hideSuccessForm() {
  document.removeEventListener('click', onOutsideSuccessFormClick);
  document.removeEventListener('keydown', onSuccessFormKeydown);
  document.body.removeChild(successForm);
  successCloseElement.removeEventListener('click', onSuccessCloseElementClick);
}

function hideErrorForm() {
  editingWindowElement.classList.remove('hidden');
  document.addEventListener('keydown', onEditingWindowKeydown);
  document.body.removeChild(errorForm);
  errorCloseElement.removeEventListener('click', onErrorCloseElementClick);
  document.removeEventListener('click', onOutsideErrorFormClick);
  document.removeEventListener('keydown', onErrorFormKeydown);
}

const showSuccessForm = () => {
  successCloseElement.addEventListener('click', onSuccessCloseElementClick);
  document.body.appendChild(successForm);
  document.addEventListener('click', onOutsideSuccessFormClick);
  document.addEventListener('keydown', onSuccessFormKeydown);
};

const showErrorForm = () => {
  editingWindowElement.classList.add('hidden');
  document.removeEventListener('keydown', onEditingWindowKeydown);
  errorCloseElement.addEventListener('click', onErrorCloseElementClick);
  document.body.appendChild(errorForm);
  document.addEventListener('click', onOutsideErrorFormClick);
  document.addEventListener('keydown', onErrorFormKeydown);
};

uploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  blockSubmitElement();

  sendData(new FormData(evt.target))
    .then(() => {
      closeEditingWindow();
      showSuccessForm();
    })
    .catch(showErrorForm)
    .finally(unblockSubmitElement);
});
