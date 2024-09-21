const isLengthWithin = (string, maxLength) => string.length <= maxLength;

const isPalindrome = (string) => {
  const normalizeString = string.replaceAll(' ', '').toLowerCase();
  let reverseString = '';

  for (let i = normalizeString.length - 1; i >= 0; i--) {
    reverseString += normalizeString[i];
  }

  return normalizeString === reverseString;
};

const getNumber = (value) => {
  const stringValue = value.toString();
  let stringResult = '';

  for (let i = 0; i < stringValue.length; i++) {
    if (!Number.isNaN(parseInt(stringValue[i], 10))) {
      stringResult += stringValue[i];
    }
  }

  return parseInt(stringResult, 10);
};
