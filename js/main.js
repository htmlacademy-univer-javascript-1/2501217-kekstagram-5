const COMMENTS_SENTENCES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];
const NAMES = [
  'Иван',
  'Владимр',
  'Александр',
  'Вадим',
  'Илья',
  'Максим',
  'Яна',
  'Анна',
  'Алина',
  'Злата',
];

const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

const createRandomIdFromRangeGenerator = (min, max) => {
  const previousValues = [];

  return function () {
    let currentValue = getRandomInteger(min, max);
    if (previousValues.length >= (max - min + 1)) {
      return null;
    }
    while (previousValues.includes(currentValue)) {
      currentValue = getRandomInteger(min, max);
    }
    previousValues.push(currentValue);
    return currentValue;
  };
};

const PHOTO_COUNT = 25;
const generatePhotoId = createRandomIdFromRangeGenerator(1, 25);
const generatePhotoIndex = createRandomIdFromRangeGenerator(1, 25);
const generateCommentId = createRandomIdFromRangeGenerator(1, 750);

const createComment = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
  message: COMMENTS_SENTENCES[getRandomInteger(0, COMMENTS_SENTENCES.length - 1)],
  name: NAMES[getRandomInteger(0, NAMES.length - 1)],
});

const createPhotoDescription = () => ({
  id: generatePhotoId(),
  url: `photos/${generatePhotoIndex()}.jpg`,
  description: 'Очень интересное описание',
  likes: getRandomInteger(15, 200),
  comments: Array.from({length: getRandomInteger(0, 30)}, createComment),
});

// eslint-disable-next-line no-unused-vars
const photos = Array.from({length: PHOTO_COUNT}, createPhotoDescription);
