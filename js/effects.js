const imageElement = document.querySelector('.img-upload__preview img');
const effectsContainerElement = document.querySelector('.effects__list');
const sliderElementContainer = document.querySelector('.img-upload__effect-level');
const sliderElement = sliderElementContainer.querySelector('.effect-level__slider');
const effectValueElement = sliderElementContainer.querySelector('.effect-level__value');

let currentEffectType;
let currentEffectClass;
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

const ChangeEffectParams = (effectClass, effectType, effectOptions) => {
  if (effectType === 'none') {
    sliderElementContainer.setAttribute('hidden', true);
  } else {
    sliderElementContainer.removeAttribute('hidden');
  }

  currentEffectClass = effectClass;
  currentEffectType = effectType;
  currentEffectOptions = effectOptions;
};

const changeEffect = (filterID) => {
  switch (filterID) {
    case 'effect-none':
      ChangeEffectParams('effects__preview--none', 'none', getEffectOptions(0, 1, 0.1, (value) => value, (value) => parseFloat(value)));
      break;
    case 'effect-chrome':
      ChangeEffectParams('effects__preview--chrome', 'grayscale', getEffectOptions(0, 1, 0.1, (value) => value.toFixed(1), (value) => parseFloat(value)));
      break;
    case 'effect-sepia':
      ChangeEffectParams('effects__preview--sepia', 'sepia', getEffectOptions(0, 1, 0.1, (value) => value.toFixed(1), (value) => parseFloat(value)));
      break;
    case 'effect-marvin':
      ChangeEffectParams('effects__preview--marvin', 'invert', getEffectOptions(0, 100, 1, (value) => `${value}%`, (value) => parseFloat(value)));
      break;
    case 'effect-phobos':
      ChangeEffectParams('effects__preview--phobos', 'blur', getEffectOptions(0, 3, 0.1, (value) => `${value.toFixed(1)}px`, (value) => parseFloat(value)));
      break;
    case 'effect-heat':
      ChangeEffectParams('effects__preview--heat', 'brightness', getEffectOptions(1, 3, 0.1, (value) => value.toFixed(1), (value) => parseFloat(value)));
      break;
  }

  imageElement.className = '';
  imageElement.classList.add(currentEffectClass);
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
  noUiSlider.create(sliderElement, getEffectOptions(0, 1, 0.1, (value) => value, (value) => parseFloat(value)));
  sliderElementContainer.setAttribute('hidden', true);
  effectsContainerElement.addEventListener('change', onEffectChange);

  sliderElement.noUiSlider.on('update', () => {
    effectValueElement.value = parseFloat(sliderElement.noUiSlider.get());
    imageElement.style.filter = (currentEffectType !== 'none') ? `${currentEffectType}(${sliderElement.noUiSlider.get()})` : '';
  });
};

const removeEffect = () => {
  effectsContainerElement.removeEventListener('change', onEffectChange);
  imageElement.className = '';
  document.getElementById('effect-none').checked = true;
  sliderElement.noUiSlider.destroy();
};

export {addEffect, removeEffect};
