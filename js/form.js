import {checkRepeats, isEscapeKey} from './util.js';
import {addEffect, removeEffect} from './effects.js';
import {addEventListenerToScaleElements, removeEventListenerFromScaleElements, setStandartImageSize} from './scale.js';
import './send-form.js';

const DEFAULT_PHOTO = 'img/upload-default-image.jpg';
const ALLOWED_FILE_TYPES = ['jpg', 'jpeg', 'png'];
const MAX_LENGTH_COMMENT = 140;
const MAX_HASHTAGS_COUNT = 5;
const HASHTAG_RE = /^#[A-Za-zА-Яа-я0-9]{1,19}$/;
const PRISTINE_ERROR_CLASS = 'upload-form__error-text';

const uploadForm = document.getElementById('upload-select-image');
const imagePreviewElement = uploadForm.querySelector('.img-upload__preview img');
const effectsPreviewElements = uploadForm.querySelectorAll('.effects__preview');
const inputImageElement = uploadForm.querySelector('.img-upload__input');
const editingImageForm = uploadForm.querySelector('.img-upload__overlay');
const closeFormElement = editingImageForm.querySelector('.img-upload__cancel');
const submitFormElement = editingImageForm.querySelector('.img-upload__submit');
const hashtagsInputElement = uploadForm.querySelector('.text__hashtags');
const descriptionInputElement = uploadForm.querySelector('.text__description');

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: PRISTINE_ERROR_CLASS
}, true);

let messageHashtagError = '';

const isHashtagValid = (hashtagString) => {
  messageHashtagError = '';
  hashtagString = hashtagString.trim().toLowerCase();

  if(!hashtagString) {
    return true;
  }

  const hashtags = hashtagString.split(/\s+/);

  if (hashtags.length === 0) {
    return true;
  }

  if (checkRepeats(hashtags)) {
    messageHashtagError = 'Хэш-теги не должны повторяться!';
    return false;
  }

  const isNotValid = hashtags.some((hashtag) => {
    if (!HASHTAG_RE.test(hashtag)) {
      messageHashtagError = 'Введён невалидный хэш-тег!';
      return true;
    }
    if (hashtags.length > MAX_HASHTAGS_COUNT) {
      messageHashtagError = `Превышено допустимое количество хэш-тегов: ${MAX_HASHTAGS_COUNT}!`;
      return true;
    }
    return false;
  });

  return !isNotValid;
};

const onFormInputElementInput = () => {
  submitFormElement.disabled = !pristine.validate();
};

const isDescriptionValid = (descriptionString) => descriptionString.length <= MAX_LENGTH_COMMENT;

const getMessageHashtagError = () => messageHashtagError;

pristine.addValidator(hashtagsInputElement, isHashtagValid, getMessageHashtagError);
pristine.addValidator(descriptionInputElement, isDescriptionValid, `Длина комментария не может составлять больше ${MAX_LENGTH_COMMENT} символов`);

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt) && evt.target !== hashtagsInputElement && evt.target !== descriptionInputElement) {
    closeEditingImageForm();
  }
};

const onCloseFormElementClick = () => closeEditingImageForm();

function closeEditingImageForm () {
  editingImageForm.classList.add('hidden');
  document.body.classList.remove('modal-open');

  submitFormElement.disabled = false;
  inputImageElement.value = '';
  imagePreviewElement.src = DEFAULT_PHOTO;
  effectsPreviewElements.forEach((preview) => {
    preview.style.removeProperty('background-image');
  });

  removeEffect();
  setStandartImageSize();
  removeEventListenerFromScaleElements();

  closeFormElement.removeEventListener('click', onCloseFormElementClick);
  document.removeEventListener('keydown', onDocumentKeydown);
  hashtagsInputElement.removeEventListener('input', onFormInputElementInput);
  descriptionInputElement.removeEventListener('input', onFormInputElementInput);

  uploadForm.reset();
  pristine.reset();
}

const openEditingImageForm = () => {
  const image = inputImageElement.files[0];

  if (ALLOWED_FILE_TYPES.some((it) => image.name.toLowerCase().endsWith(it))) {
    imagePreviewElement.src = URL.createObjectURL(image);
    effectsPreviewElements.forEach((preview) => {
      preview.style.backgroundImage = `url('${URL.createObjectURL(image)}')`;
    });
  }

  addEffect();
  addEventListenerToScaleElements();

  closeFormElement.addEventListener('click', onCloseFormElementClick);
  document.addEventListener('keydown', onDocumentKeydown);
  hashtagsInputElement.addEventListener('input', onFormInputElementInput);
  descriptionInputElement.addEventListener('input', onFormInputElementInput);

  document.body.classList.add('modal-open');
  editingImageForm.classList.remove('hidden');
};

const onInputImageElementChange = () => openEditingImageForm();

inputImageElement.addEventListener('change', onInputImageElementChange);

export {closeEditingImageForm, onDocumentKeydown};
