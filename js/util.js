const ALERT_SHOW_TIME = 5000;

const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (upper - lower + 1) + lower);
};

const checkRepeats = (arr) => new Set(arr).size !== arr.length;

const isEscapeKey = (evt) => evt.key === 'Escape';

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};

const getArrayRandomSample = (array, sampleSize) => {
  if (array.length <= sampleSize) {
    return array.slice();
  }

  const temporaryArray = array.slice();
  const sample = [];
  for (let i = 0; i < sampleSize; i++) {
    const randomIndex = getRandomInteger(0, temporaryArray.length - 1);
    sample.push(temporaryArray[randomIndex]);
    temporaryArray.splice(randomIndex, 1);
  }
  return sample;
};

const debounce = (cb, timeoutDelay) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => cb.apply(this, rest), timeoutDelay);
  };
};

export {checkRepeats, isEscapeKey, showAlert, getArrayRandomSample, debounce};
