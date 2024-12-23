import {checkForDuplicates, isEscapeKey} from './util.js';
import {addEffect, removeEffect} from './effects.js';
import {addEventListenersToScaleElements, removeEventListenersFromScaleElements, resetImageElementScale} from './scale.js';
import './send-form.js';

const CLASS_HIDDEN = 'hidden';
const CLASS_MODAL_OPEN = 'modal-open';
const STYLE_BACKGROUND_IMAGE = 'background-image';
const DEFAULT_PHOTO = 'img/upload-default-image.jpg';
const ALLOWED_FILE_TYPES = ['jpg', 'jpeg', 'png'];
const MAX_LENGTH_COMMENT = 140;
const MAX_HASHTAGS_COUNT = 5;
const HASHTAG_RE = /^#[A-Za-zА-Яа-я0-9]{1,19}$/;
const PRISTINE_ERROR_CLASS = 'upload-form__error-text';

const uploadFormElement = document.getElementById('upload-select-image');
const imagePreviewElement = uploadFormElement.querySelector('.img-upload__preview img');
const effectsPreviewElements = uploadFormElement.querySelectorAll('.effects__preview');
const inputImageElement = uploadFormElement.querySelector('.img-upload__input');
const editingImageFormElement = uploadFormElement.querySelector('.img-upload__overlay');
const closeFormElement = editingImageFormElement.querySelector('.img-upload__cancel');
const submitFormElement = editingImageFormElement.querySelector('.img-upload__submit');
const hashtagsInputElement = uploadFormElement.querySelector('.text__hashtags');
const descriptionInputElement = uploadFormElement.querySelector('.text__description');

const pristine = new Pristine(uploadFormElement, {
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

  if (hashtags.length > MAX_HASHTAGS_COUNT) {
    messageHashtagError = `Превышено допустимое количество хэш-тегов: ${MAX_HASHTAGS_COUNT}!`;
    return false;
  }

  if (hashtags.some((hashtag) => !HASHTAG_RE.test(hashtag))) {
    messageHashtagError = 'Введён невалидный хэш-тег!';
    return false;
  }

  if (checkForDuplicates(hashtags)) {
    messageHashtagError = 'Хэш-теги не должны повторяться!';
    return false;
  }

  return true;
};

const onFormInputElementInput = () => {
  submitFormElement.disabled = !pristine.validate();
};

const isDescriptionValid = (descriptionString) => descriptionString.length <= MAX_LENGTH_COMMENT;

const getMessageHashtagError = () => messageHashtagError;

pristine.addValidator(hashtagsInputElement, isHashtagValid, getMessageHashtagError);
pristine.addValidator(descriptionInputElement, isDescriptionValid, `Длина комментария не может составлять больше ${MAX_LENGTH_COMMENT} символов!`);

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt) && evt.target !== hashtagsInputElement && evt.target !== descriptionInputElement) {
    closeEditingImageFormElement();
  }
};

const onCloseFormElementClick = () => closeEditingImageFormElement();

function closeEditingImageFormElement () {
  editingImageFormElement.classList.add(CLASS_HIDDEN);
  document.body.classList.remove(CLASS_MODAL_OPEN);

  submitFormElement.disabled = false;
  inputImageElement.value = '';
  imagePreviewElement.src = DEFAULT_PHOTO;
  effectsPreviewElements.forEach((preview) => {
    preview.style.removeProperty(STYLE_BACKGROUND_IMAGE);
  });

  removeEffect();
  resetImageElementScale();
  removeEventListenersFromScaleElements();

  closeFormElement.removeEventListener('click', onCloseFormElementClick);
  document.removeEventListener('keydown', onDocumentKeydown);
  hashtagsInputElement.removeEventListener('input', onFormInputElementInput);
  descriptionInputElement.removeEventListener('input', onFormInputElementInput);

  uploadFormElement.reset();
  pristine.reset();
}

const openEditingImageFormElement = () => {
  const image = inputImageElement.files[0];

  if (ALLOWED_FILE_TYPES.some((it) => image.name.toLowerCase().endsWith(it))) {
    const imageURL = URL.createObjectURL(image);
    imagePreviewElement.src = imageURL;
    effectsPreviewElements.forEach((preview) => {
      preview.style.backgroundImage = `url('${imageURL}')`;
    });
  }

  addEffect();
  addEventListenersToScaleElements();

  closeFormElement.addEventListener('click', onCloseFormElementClick);
  document.addEventListener('keydown', onDocumentKeydown);
  hashtagsInputElement.addEventListener('input', onFormInputElementInput);
  descriptionInputElement.addEventListener('input', onFormInputElementInput);

  document.body.classList.add(CLASS_MODAL_OPEN);
  editingImageFormElement.classList.remove(CLASS_HIDDEN);
};

const onInputImageElementChange = () => openEditingImageFormElement();

inputImageElement.addEventListener('change', onInputImageElementChange);

export {closeEditingImageFormElement, onDocumentKeydown};
