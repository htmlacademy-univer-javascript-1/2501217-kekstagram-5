import {checkRepeats, isEscapeKey} from './util.js';
import {addEffect, removeEffect} from './effects.js';
import {addEventListenerToScaleElements, removeEventListenerFromScaleElements, setStandartImageSize} from './scale.js';
import {sendData} from './api.js';

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
const submitFormElement = uploadForm.querySelector('.img-upload__submit');
const hashtagsInputElement = uploadForm.querySelector('.text__hashtags');
const descriptionInputElement = uploadForm.querySelector('.text__description');
const successForm = document.getElementById('success').content.querySelector('.success');
const successCloseElement = successForm.querySelector('.success__button');
const errorForm = document.getElementById('error').content.querySelector('.error');
const errorCloseElement = errorForm.querySelector('.error__button');

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

  hashtags.forEach((hashtag) => {
    if (!HASHTAG_RE.test(hashtag)) {
      messageHashtagError = 'Введён невалидный хэш-тег!';
    } else if (hashtags.length > MAX_HASHTAGS_COUNT) {
      messageHashtagError = `Превышено допустимое количество хэш-тегов: ${MAX_HASHTAGS_COUNT}!`;
    } else if (checkRepeats(hashtags)) {
      messageHashtagError = 'Хэш-теги не должны повторяться!';
    } else {
      return true;
    }
    return false;
  });
};

const onFormInputElementInput = () => {
  if (pristine.validate()) {
    submitFormElement.disabled = false;
  } else {
    submitFormElement.disabled = true;
  }
};

const isDescriptionValid = (descriptionString) => descriptionString.length <= MAX_LENGTH_COMMENT;

const getMessageHashtagError = () => messageHashtagError;

pristine.addValidator(hashtagsInputElement, isHashtagValid, getMessageHashtagError);
pristine.addValidator(descriptionInputElement, isDescriptionValid, `Длина комментария не может составлять больше ${MAX_LENGTH_COMMENT} символов`);

const onEditingImageFormKeydown = (evt) => {
  if (isEscapeKey(evt) && evt.target !== hashtagsInputElement && evt.target !== descriptionInputElement) {
    closeEditingImageForm();
  }
};

const onCloseFormElementClick = () => closeEditingImageForm();

function closeEditingImageForm() {
  editingImageForm.classList.add('hidden');
  document.body.classList.remove('modal-open');

  inputImageElement.value = '';
  imagePreviewElement.src = DEFAULT_PHOTO;
  effectsPreviewElements.forEach((preview) => {
    preview.style.removeProperty('background-image');
  });

  removeEffect();
  setStandartImageSize();
  removeEventListenerFromScaleElements();

  closeFormElement.removeEventListener('click', onCloseFormElementClick);
  document.removeEventListener('keydown', onEditingImageFormKeydown);
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
  document.addEventListener('keydown', onEditingImageFormKeydown);
  hashtagsInputElement.addEventListener('input', onFormInputElementInput);
  descriptionInputElement.addEventListener('input', onFormInputElementInput);

  document.body.classList.add('modal-open');
  editingImageForm.classList.remove('hidden');
};

const oninputImageElementChange = () => openEditingImageForm();

inputImageElement.addEventListener('change', oninputImageElementChange);

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

function hideSuccessForm() {
  document.removeEventListener('click', onOutsideSuccessFormClick);
  document.removeEventListener('keydown', onSuccessFormKeydown);
  successCloseElement.removeEventListener('click', onSuccessCloseElementClick);
  document.body.removeChild(successForm);
}

function hideErrorForm() {
  errorCloseElement.removeEventListener('click', onErrorCloseElementClick);
  document.removeEventListener('click', onOutsideErrorFormClick);
  document.removeEventListener('keydown', onErrorFormKeydown);
  document.body.removeChild(errorForm);
  document.addEventListener('keydown', onEditingImageFormKeydown);
  editingImageForm.classList.remove('hidden');
}

const showSuccessForm = () => {
  successCloseElement.addEventListener('click', onSuccessCloseElementClick);
  document.addEventListener('click', onOutsideSuccessFormClick);
  document.addEventListener('keydown', onSuccessFormKeydown);
  document.body.appendChild(successForm);
};

const showErrorForm = () => {
  document.removeEventListener('keydown', onEditingImageFormKeydown);
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
