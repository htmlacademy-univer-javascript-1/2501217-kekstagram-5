import {createPhotos} from './data.js';

const picturesListElement = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

const photos = createPhotos();
const photosListFragment = document.createDocumentFragment();

photos.forEach(({url, description, likes, comments}) => {
  const pictureElement = pictureTemplate.cloneNode(true);
  const pictureImage = pictureElement.querySelector('.picture__img');
  pictureImage.src = url;
  pictureImage.alt = description;
  pictureElement.querySelector('.picture__likes').textContent = likes;
  pictureElement.querySelector('.picture__comments').textContent = comments.length;
  photosListFragment.appendChild(pictureElement);
});

picturesListElement.appendChild(photosListFragment);
