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
const successFormTemplate = document.querySelector('#success').content.querySelector('.success');
const errorFormTemplate = document.querySelector('#error').content.querySelector('.error');
const errorElement = errorFormTemplate.querySelector('.error__button');
const successElement = successFormTemplate.querySelector('.success__button');

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

const stopPropagation = (event) => event.stopPropagation();

const closeEditingWindow = () => {
  editingWindowElement.classList.add('hidden');
  document.body.classList.remove('modal-open');

  closeElement.removeEventListener('click', closeEditingWindow);
  // eslint-disable-next-line no-use-before-define
  document.removeEventListener('keydown', editingWindowKeydownHandler);
  hashtagsInputElement.removeEventListener('keydown', stopPropagation);
  descriptionInputElement.removeEventListener('keydown', stopPropagation);
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
    for (const errorContainer of errorContainers) {
      errorContainer.setAttribute('style', 'display: none;');
    }
  }
};

const editingWindowKeydownHandler = getKeydownHandler(closeEditingWindow);

const openEditingWindow = () => {
  editingWindowElement.classList.remove('hidden');
  document.body.classList.add('modal-open');

  closeElement.addEventListener('click', closeEditingWindow);
  document.addEventListener('keydown', editingWindowKeydownHandler);
  hashtagsInputElement.addEventListener('keydown', stopPropagation);
  descriptionInputElement.addEventListener('keydown', stopPropagation);
  hashtagsInputElement.addEventListener('input', onFormInput);
  descriptionInputElement.addEventListener('input', onFormInput);

  addEventListenerToScaleElemets();
  addFilter();
};

loadImgElement.addEventListener('change', openEditingWindow);

const blockSubmitBtn = () => {
  submitElement.disabled = true;
  submitElement.textContent = 'Публикация...';
};

const unblockSubmitBtn = () => {
  submitElement.disabled = false;
  submitElement.textContent = 'Опубликовать';
};

const outOfSuccessFormHandler = (evt) => {
  if (evt.target.closest('.success__inner') === null) {
    hideSuccessForm();
  }
};

const outOfErrorFormHandler = (evt) => {
  if (evt.target.closest('.error__inner') === null) {
    hideErrorForm();
  }
};

const successFormKeydownHandler = getKeydownHandler(hideSuccessForm);
const errorFormKeydownHandler = getKeydownHandler(hideErrorForm);

function hideSuccessForm() {
  document.removeEventListener('click', outOfSuccessFormHandler);
  document.removeEventListener('keydown', successFormKeydownHandler);
  document.body.removeChild(successFormTemplate);
  successElement.removeEventListener('click', hideSuccessForm);
}

function hideErrorForm() {
  editingWindowElement.classList.remove('hidden');
  document.addEventListener('keydown', editingWindowKeydownHandler);
  document.body.removeChild(errorFormTemplate);
  errorElement.removeEventListener('click', hideErrorForm);
  document.removeEventListener('click', outOfErrorFormHandler);
  document.removeEventListener('keydown', errorFormKeydownHandler);
}

const showSuccessForm = () => {
  successElement.addEventListener('click', hideSuccessForm);
  document.body.appendChild(successFormTemplate);
  document.addEventListener('click', outOfSuccessFormHandler);
  document.addEventListener('keydown', successFormKeydownHandler);
};

const showErrorForm = () => {
  editingWindowElement.classList.add('hidden');
  document.removeEventListener('keydown', editingWindowKeydownHandler);
  errorElement.addEventListener('click', hideErrorForm);
  document.body.appendChild(errorFormTemplate);
  document.addEventListener('click', outOfErrorFormHandler);
  document.addEventListener('keydown', errorFormKeydownHandler);
};

uploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  blockSubmitBtn();

  sendData(new FormData(evt.target))
    .then(() => {
      closeEditingWindow();
      showSuccessForm();
    })
    .catch(showErrorForm)
    .finally(unblockSubmitBtn);
});
