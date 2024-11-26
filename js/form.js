import { isEscapeKey, checkRepeats } from './util.js';
import { addEventListenerToScaleElemets, removeEventListenerFromScaleElemets, addFilter, removeFilter } from './effects.js';

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

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    // eslint-disable-next-line no-use-before-define
    closeEditingWindow();
  }
};

const stopPropagation = (event) => event.stopPropagation();

const closeEditingWindow = () => {
  editingWindowElement.classList.add('hidden');
  document.body.classList.remove('modal-open');

  closeElement.removeEventListener('click', closeEditingWindow);
  document.removeEventListener('keydown', onDocumentKeydown);
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

const openEditingWindow = () => {
  editingWindowElement.classList.remove('hidden');
  document.body.classList.add('modal-open');

  closeElement.addEventListener('click', closeEditingWindow);
  document.addEventListener('keydown', onDocumentKeydown);
  hashtagsInputElement.addEventListener('keydown', stopPropagation);
  descriptionInputElement.addEventListener('keydown', stopPropagation);
  hashtagsInputElement.addEventListener('input', onFormInput);
  descriptionInputElement.addEventListener('input', onFormInput);

  addEventListenerToScaleElemets();
  addFilter();
};

loadImgElement.addEventListener('change', openEditingWindow);
