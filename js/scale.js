const MIN_SCALE = 25;
const MAX_SCALE = 100;
const STEP = 25;

const zoomOutElement = document.querySelector('.scale__control--smaller');
const zoomInElement = document.querySelector('.scale__control--bigger');
const scaleValueElement = document.querySelector('.scale__control--value');
const imageElement = document.querySelector('.img-upload__preview img');

const updateScale = (direction) => {
  let scaleValue = parseInt(scaleValueElement.value, 10);
  scaleValue += direction * STEP;

  if (scaleValue >= MIN_SCALE && scaleValue <= MAX_SCALE) {
    scaleValueElement.value = `${scaleValue}%`;
    imageElement.style.transform = `scale(${scaleValue / 100})`;
  }
};

const zoomOutImage = () => updateScale(-1);
const zoomInImage = () => updateScale(1);

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
  scaleValueElement.value = '100%';
};

export {addEventListenerToScaleElements, removeEventListenerFromScaleElements, setStandartImageSize};
