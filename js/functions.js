// eslint-disable-next-line no-unused-vars
const isLengthWithin = (string, maxLength) => string.length <= maxLength;

// eslint-disable-next-line no-unused-vars
const isPalindrome = (string) => {
  const normalizeString = string.replaceAll(' ', '').toLowerCase();
  let reverseNormalizeString = '';

  for (let i = normalizeString.length - 1; i >= 0; i--) {
    reverseNormalizeString += normalizeString[i];
  }

  return normalizeString === reverseNormalizeString;
};

// eslint-disable-next-line no-unused-vars
const getNumber = (value) => {
  let newValue = value;

  if (typeof value === 'number') {
    newValue = String(value);
  }

  let stringResult = '';

  for (let i = 0; i < newValue.length; i++) {
    if (!Number.isNaN(parseInt(newValue[i], 10))) {
      stringResult += newValue[i];
    }
  }

  return Number(stringResult);
};
