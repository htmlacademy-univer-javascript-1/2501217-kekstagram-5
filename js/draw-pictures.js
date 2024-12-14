import {openBigPicture} from './draw-big-picture.js';

const picturesListElement = document.querySelector('.pictures');
const pictureTemplate = document.getElementById('picture').content.querySelector('.picture');

let currentPictures = [];

const renderPictures = (pictures) => {
  currentPictures = pictures;
  const picturesListFragment = document.createDocumentFragment();

  pictures.forEach(({url, description, likes, comments}) => {
    const pictureElement = pictureTemplate.cloneNode(true);
    const pictureImage = pictureElement.querySelector('.picture__img');
    pictureImage.src = url;
    pictureImage.alt = description;
    pictureElement.querySelector('.picture__likes').textContent = likes;
    pictureElement.querySelector('.picture__comments').textContent = comments.length;
    picturesListFragment.appendChild(pictureElement);
  });

  picturesListElement.querySelectorAll('.picture').forEach((picture) => picture.remove());
  picturesListElement.appendChild(picturesListFragment);
};

picturesListElement.addEventListener('click', (evt) => {
  const pictureElement = evt.target.closest('.picture');
  if (pictureElement) {
    const picture = currentPictures.find((pic) => pic.url === pictureElement.querySelector('.picture__img').getAttribute('src'));
    openBigPicture(picture);
  }
});

export {renderPictures};
