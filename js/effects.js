const CLASS_HIDDEN = 'hidden';

const imageElement = document.querySelector('.img-upload__preview img');
const effectsContainerElement = document.querySelector('.effects__list');
const sliderContainerElement = document.querySelector('.img-upload__effect-level');
const sliderElement = sliderContainerElement.querySelector('.effect-level__slider');
const effectValueElement = sliderContainerElement.querySelector('.effect-level__value');

const EffectsConfig = {
  NONE: {
    id: 'effect-none',
    type: 'none',
    params: { min: 0, max: 1, step: 0.1 },
    format: (value) => value,
    parse: (value) => parseFloat(value),
  },
  CHROME: {
    id: 'effect-chrome',
    type: 'grayscale',
    params: { min: 0, max: 1, step: 0.1 },
    format: (value) => value.toFixed(1),
    parse: (value) => parseFloat(value),
  },
  SEPIA: {
    id: 'effect-sepia',
    type: 'sepia',
    params: { min: 0, max: 1, step: 0.1 },
    format: (value) => value.toFixed(1),
    parse: (value) => parseFloat(value),
  },
  MARVIN: {
    id: 'effect-marvin',
    type: 'invert',
    params: { min: 0, max: 100, step: 1 },
    format: (value) => `${value}%`,
    parse: (value) => parseFloat(value),
  },
  PHOBOS: {
    id: 'effect-phobos',
    type: 'blur',
    params: { min: 0, max: 3, step: 0.1 },
    format: (value) => `${value.toFixed(1)}px`,
    parse: (value) => parseFloat(value),
  },
  HEAT: {
    id: 'effect-heat',
    type: 'brightness',
    params: { min: 1, max: 3, step: 0.1 },
    format: (value) => value.toFixed(1),
    parse: (value) => parseFloat(value),
  },
};

let currentEffect = EffectsConfig.NONE;

const getSliderOptions = ({ params, format, parse }) => ({
  range: {
    min: params.min,
    max: params.max,
  },
  start: params.max,
  step: params.step,
  connect: 'lower',
  format: { to: format, from: parse },
});

const setEffectParams = (effect) => {
  if (effect.type === 'none') {
    sliderContainerElement.classList.add(CLASS_HIDDEN);
  } else {
    sliderContainerElement.classList.remove(CLASS_HIDDEN);
  }

  currentEffect = effect;
  sliderElement.noUiSlider.updateOptions(getSliderOptions(effect));
};

const onEffectChange = (evt) => {
  setEffectParams(Object.values(EffectsConfig).find((config) => config.id === evt.target.id));
};

const addEffect = () => {
  currentEffect = EffectsConfig.NONE;
  effectValueElement.value = currentEffect.params.max;
  noUiSlider.create(sliderElement, getSliderOptions(currentEffect));
  sliderContainerElement.classList.add(CLASS_HIDDEN);
  effectsContainerElement.addEventListener('change', onEffectChange);

  sliderElement.noUiSlider.on('update', () => {
    effectValueElement.value = parseFloat(sliderElement.noUiSlider.get());
    imageElement.style.filter = (currentEffect.type !== 'none') ? `${currentEffect.type}(${sliderElement.noUiSlider.get()})` : '';
  });
};

const removeEffect = () => {
  effectsContainerElement.removeEventListener('change', onEffectChange);
  document.getElementById(EffectsConfig.NONE.id).checked = true;
  imageElement.style.filter = '';
  sliderElement.noUiSlider.destroy();
};

export {addEffect, removeEffect};
