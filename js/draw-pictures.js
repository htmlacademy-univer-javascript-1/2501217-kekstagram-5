import {openBigPictureElement} from './draw-big-picture.js';

const picturesListElement = document.querySelector('.pictures');
const pictureTemplateElement = document.getElementById('picture').content.querySelector('.picture');

let currentPictures = [];

const renderPictures = (pictures) => {
  currentPictures = pictures;
  const picturesListFragment = document.createDocumentFragment();

  pictures.forEach(({url, description, likes, comments}) => {
    const pictureElement = pictureTemplateElement.cloneNode(true);
    const pictureImageElement = pictureElement.querySelector('.picture__img');
    pictureImageElement.src = url;
    pictureImageElement.alt = description;
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
    openBigPictureElement(picture);
  }
});

export {renderPictures};
