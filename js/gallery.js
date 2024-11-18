import {renderPicturesList} from './draw-pictures.js';
import {openBigPicture} from './draw-big-picture.js';
import {createPhotos} from './data.js';

const pictures = createPhotos();
renderPicturesList(pictures);

const onClickPicture = (evt) => {
  const pictureElement = evt.target.closest('.picture');
  if (pictureElement) {
    const picture = pictures.find((pic) => pic.url === pictureElement.querySelector('.picture__img').getAttribute('src'));
    openBigPicture(picture);
  }
};

document.querySelector('.pictures').addEventListener('click', onClickPicture);
