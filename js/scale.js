const MIN_SCALE = 25;
const MAX_SCALE = 100;
const STEP = 25;
const DEFAULT_SCALE = 100;

const zoomOutElement = document.querySelector('.scale__control--smaller');
const zoomInElement = document.querySelector('.scale__control--bigger');
const scaleValueElement = document.querySelector('.scale__control--value');
const imageElement = document.querySelector('.img-upload__preview img');

const updateScale = (direction) => {
  let scaleValue = parseInt(scaleValueElement.value, 10) || DEFAULT_SCALE;
  const newScaleValue = scaleValue + direction * STEP;

  if (newScaleValue >= MIN_SCALE && newScaleValue <= MAX_SCALE) {
    scaleValue = newScaleValue;
    scaleValueElement.value = `${scaleValue}%`;
    imageElement.style.transform = `scale(${scaleValue / 100})`;
  }
};

const onZoomOutElementClick = () => updateScale(-1);
const onZoomInElementClick = () => updateScale(1);

const addEventListenersToScaleElements = () => {
  zoomOutElement.addEventListener('click', onZoomOutElementClick);
  zoomInElement.addEventListener('click', onZoomInElementClick);
};

const removeEventListenersFromScaleElements = () => {
  zoomOutElement.removeEventListener('click', onZoomOutElementClick);
  zoomInElement.removeEventListener('click', onZoomInElementClick);
};

const resetImageElementScale = () => {
  imageElement.style.transform = `scale(${DEFAULT_SCALE / 100})`;
  scaleValueElement.value = `${DEFAULT_SCALE}%`;
};

export {addEventListenersToScaleElements, removeEventListenersFromScaleElements, resetImageElementScale};
