const imageElement = document.querySelector('.img-upload__preview img');
const effectsContainerElement = document.querySelector('.effects__list');
const sliderElementContainer = document.querySelector('.img-upload__effect-level');
const sliderElement = sliderElementContainer.querySelector('.effect-level__slider');
const effectValueElement = sliderElementContainer.querySelector('.effect-level__value');

const EffectsParams = {
  NONE: {
    MIN: 0,
    MAX: 1,
    STEP: 0.1
  },
  CHROME: {
    MIN: 0,
    MAX: 1,
    STEP: 0.1
  },
  SEPIA: {
    MIN: 0,
    MAX: 1,
    STEP: 0.1
  },
  MARVIN: {
    MIN: 0,
    MAX: 100,
    STEP: 1
  },
  PHOBOS: {
    MIN: 0,
    MAX: 3,
    STEP: 0.1
  },
  HEAT: {
    MIN: 1,
    MAX: 3,
    STEP: 0.1
  }
};

let currentEffectType;
let currentEffectOptions;

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

const ChangeEffectParams = (effectType, effectOptions) => {
  if (effectType === 'none') {
    sliderElementContainer.setAttribute('hidden', true);
  } else {
    sliderElementContainer.removeAttribute('hidden');
  }

  currentEffectType = effectType;
  currentEffectOptions = effectOptions;
};

const changeEffect = (effectID) => {
  switch (effectID) {
    case 'effect-none':
      ChangeEffectParams('none',
        getEffectOptions(EffectsParams.NONE.MIN, EffectsParams.NONE.MAX, EffectsParams.NONE.STEP, (value) => value, (value) => parseFloat(value)));
      break;
    case 'effect-chrome':
      ChangeEffectParams('grayscale',
        getEffectOptions(EffectsParams.CHROME.MIN, EffectsParams.CHROME.MAX, EffectsParams.CHROME.STEP, (value) => value.toFixed(1), (value) => parseFloat(value)));
      break;
    case 'effect-sepia':
      ChangeEffectParams('sepia',
        getEffectOptions(EffectsParams.SEPIA.MIN, EffectsParams.SEPIA.MAX, EffectsParams.SEPIA.STEP, (value) => value.toFixed(1), (value) => parseFloat(value)));
      break;
    case 'effect-marvin':
      ChangeEffectParams('invert',
        getEffectOptions(EffectsParams.MARVIN.MIN, EffectsParams.MARVIN.MAX, EffectsParams.MARVIN.STEP, (value) => `${value}%`, (value) => parseFloat(value)));
      break;
    case 'effect-phobos':
      ChangeEffectParams('blur',
        getEffectOptions(EffectsParams.PHOBOS.MIN, EffectsParams.PHOBOS.MAX, EffectsParams.PHOBOS.STEP, (value) => `${value.toFixed(1)}px`, (value) => parseFloat(value)));
      break;
    case 'effect-heat':
      ChangeEffectParams('brightness',
        getEffectOptions(EffectsParams.HEAT.MIN, EffectsParams.HEAT.MAX, EffectsParams.HEAT.STEP, (value) => value.toFixed(1), (value) => parseFloat(value)));
      break;
  }

  sliderElement.noUiSlider.updateOptions(currentEffectOptions);
};

const onEffectChange = (evt) => {
  if (evt.target.closest('.effects__item')) {
    changeEffect(evt.target.id);
  }
};

const addEffect = () => {
  effectValueElement.value = 1;
  currentEffectType = 'none';
  currentEffectOptions = getEffectOptions(EffectsParams.NONE.MIN, EffectsParams.NONE.MAX, EffectsParams.NONE.STEP, (value) => value, (value) => parseFloat(value));
  noUiSlider.create(sliderElement, currentEffectOptions);
  sliderElementContainer.setAttribute('hidden', true);
  effectsContainerElement.addEventListener('change', onEffectChange);

  sliderElement.noUiSlider.on('update', () => {
    effectValueElement.value = parseFloat(sliderElement.noUiSlider.get());
    imageElement.style.filter = (currentEffectType !== 'none') ? `${currentEffectType}(${sliderElement.noUiSlider.get()})` : '';
  });
};

const removeEffect = () => {
  effectsContainerElement.removeEventListener('change', onEffectChange);
  document.getElementById('effect-none').checked = true;
  imageElement.style.filter = '';
  sliderElement.noUiSlider.destroy();
};

export {addEffect, removeEffect};
