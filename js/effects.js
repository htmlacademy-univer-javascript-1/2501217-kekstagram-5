const MIN_SCALE = 25;
const MAX_SCALE = 100;
const STEP = 25;

const zoomOutElement = document.querySelector('.scale__control--smaller');
const zoomInElement = document.querySelector('.scale__control--bigger');
const scaleValueElement = document.querySelector('.scale__control--value');
const imageElement = document.querySelector('.img-upload__preview img');
const filtersContainerElement = document.querySelector('.effects__list');
const sliderElementContainer = document.querySelector('.img-upload__effect-level');
const sliderElement = sliderElementContainer.querySelector('.effect-level__slider');
const filterValueElement = sliderElementContainer.querySelector('.effect-level__value');
let filterType = 'none';

const zoomOutImage = () => {
  let scaleValue = parseInt(scaleValueElement.value, 10);
  if (scaleValue > MIN_SCALE) {
    scaleValue -= STEP;
    scaleValueElement.value = scaleValue.toString();
    imageElement.style.transform = `scale(${scaleValue / 100})`;
  }
};

const zoomInImage = () => {
  let scaleValue = parseInt(scaleValueElement.value, 10);
  if (scaleValue < MAX_SCALE) {
    scaleValue += STEP;
    scaleValueElement.value = scaleValue.toString();
    imageElement.style.transform = `scale(${scaleValue / 100})`;
  }
};

const addEventListenerToScaleElemets = () => {
  zoomOutElement.addEventListener('click', zoomOutImage);
  zoomInElement.addEventListener('click', zoomInImage);
};

const removeEventListenerFromScaleElemets = () => {
  zoomOutElement.removeEventListener('click', zoomOutImage);
  zoomInElement.removeEventListener('click', zoomInImage);
};

const getEffectOptions = (min, max, step, funcTo, funcFrom) => ({
  range: {
    min: min,
    max: max,
  },
  start: max,
  step: step,
  connect: 'lower',
  format: {
    to: funcTo,
    from: funcFrom
  }
});

const changeFilter = (filterID) => {
  let filterClass;
  let effectOptions;
  switch (filterID) {
    case 'effect-none':
      sliderElementContainer.setAttribute('hidden', true);
      filterClass = 'effects__preview--none';
      filterType = 'none';
      effectOptions = getEffectOptions(0, 1, 0.1, (value) => value, (value) => parseFloat(value));
      break;
    case 'effect-chrome':
      sliderElementContainer.removeAttribute('hidden');
      filterClass = 'effects__preview--chrome';
      filterType = 'grayscale';
      effectOptions = getEffectOptions(0, 1, 0.1, (value) => value.toFixed(1), (value) => parseFloat(value));
      break;
    case 'effect-sepia':
      sliderElementContainer.removeAttribute('hidden');
      filterClass = 'effects__preview--sepia';
      filterType = 'sepia';
      effectOptions = getEffectOptions(0, 1, 0.1, (value) => value.toFixed(1), (value) => parseFloat(value));
      break;
    case 'effect-marvin':
      sliderElementContainer.removeAttribute('hidden');
      filterClass = 'effects__preview--marvin';
      filterType = 'invert';
      effectOptions = getEffectOptions(0, 100, 1, (value) => `${value}%`, (value) => parseFloat(value));
      break;
    case 'effect-phobos':
      sliderElementContainer.removeAttribute('hidden');
      filterClass = 'effects__preview--phobos';
      filterType = 'blur';
      effectOptions = getEffectOptions(0, 3, 0.1, (value) => `${value.toFixed(1)}px`, (value) => parseFloat(value));
      break;
    case 'effect-heat':
      sliderElementContainer.removeAttribute('hidden');
      filterClass = 'effects__preview--heat';
      filterType = 'brightness';
      effectOptions = getEffectOptions(1, 3, 0.1, (value) => value.toFixed(1), (value) => parseFloat(value));
      break;
  }

  imageElement.className = '';
  imageElement.classList.add(filterClass);
  sliderElement.noUiSlider.updateOptions(effectOptions);
};

const onfilterChange = (evt) => {
  if (evt.target.closest('.effects__item')) {
    changeFilter(evt.target.id);
  }
};

const addFilter = () => {
  filterValueElement.value = 1;
  filterType = 'none';
  noUiSlider.create(sliderElement, getEffectOptions(0, 1, 0.1, (value) => value, (value) => parseFloat(value)));
  sliderElementContainer.setAttribute('hidden', true);
  filtersContainerElement.addEventListener('change', onfilterChange);

  sliderElement.noUiSlider.on('update', () => {
    filterValueElement.value = parseFloat(sliderElement.noUiSlider.get());
    imageElement.style.filter = (filterType !== 'none') ? `${filterType}(${sliderElement.noUiSlider.get()})` : '';
  });
};

const removeFilter = () => {
  filtersContainerElement.removeEventListener('change', onfilterChange);
  imageElement.className = '';
  imageElement.style.transform = 'scale(1)';
  document.getElementById('effect-none').checked = true;
  sliderElement.noUiSlider.destroy();
};

export {addEventListenerToScaleElemets, removeEventListenerFromScaleElemets, addFilter, removeFilter };
