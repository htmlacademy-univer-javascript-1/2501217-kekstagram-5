const MIN_SCALE = 25;
const MAX_SCALE = 100;
const STEP = 25;

const zoomOutElement = document.querySelector('.scale__control--smaller');
const zoomInElement = document.querySelector('.scale__control--bigger');
const scaleValueElement = document.querySelector('.scale__control--value');
const imageElement = document.querySelector('.img-upload__preview img');

const zoomOutImage = () => {
  let scaleValue = parseInt(scaleValueElement.value, 10);
  if (scaleValue > MIN_SCALE) {
    scaleValue -= STEP;
    scaleValueElement.value = `${scaleValue.toString()}%`;
    imageElement.style.transform = `scale(${scaleValue / 100})`;
  }
};

const zoomInImage = () => {
  let scaleValue = parseInt(scaleValueElement.value, 10);
  if (scaleValue < MAX_SCALE) {
    scaleValue += STEP;
    scaleValueElement.value = `${scaleValue.toString()}%`;
    imageElement.style.transform = `scale(${scaleValue / 100})`;
  }
};

const addEventListenerToScaleElements = () => {
  zoomOutElement.addEventListener('click', zoomOutImage);
  zoomInElement.addEventListener('click', zoomInImage);
};

const removeEventListenerFromScaleElements = () => {
  zoomOutElement.removeEventListener('click', zoomOutImage);
  zoomInElement.removeEventListener('click', zoomInImage);
};

const setStandartImageSize = () => {
  imageElement.style.transform = 'scale(1)';
};

export {addEventListenerToScaleElements, removeEventListenerFromScaleElements, setStandartImageSize};
