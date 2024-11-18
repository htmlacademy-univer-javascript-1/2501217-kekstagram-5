import {getRandomInteger, createRandomIdFromRangeGenerator, getRandomElementFromArray} from './util.js';

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

const PHOTO_COUNT = 25;
const generatePhotoId = createRandomIdFromRangeGenerator(1, 25);
const generateCommentId = createRandomIdFromRangeGenerator(1, 750);

const createComment = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
  message: getRandomElementFromArray(COMMENTS_SENTENCES),
  name: getRandomElementFromArray(NAMES),
});

const createPhoto = () => {
  const photoID = generatePhotoId();
  return {
    id: photoID,
    url: `photos/${photoID}.jpg`,
    description: `Описание фото номер ${photoID}`,
    likes: getRandomInteger(15, 200),
    comments: Array.from({length: getRandomInteger(0, 30)}, createComment),
  };
};

const createPhotos = () => Array.from({length: PHOTO_COUNT}, createPhoto);

export {createPhotos};
