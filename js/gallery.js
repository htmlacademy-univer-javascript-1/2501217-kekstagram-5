import {renderPicturesList} from './draw-pictures.js';
import {getData} from './api.js';
import { showAlert, getArrayRandomSample, debounce } from './util.js';

const TIMEOUT_DELAY = 500;
const RANDOM_PICTURES_COUNT = 10;
const FILTER_ELEMENT_ACTIVE_CLASS = 'img-filters__button--active';
const FILTER_DEFAULT_ID = 'filter-default';
const FILTER_RANDOM_ID = 'filter-random';
const FILTER_DISCUSSED_ID = 'filter-discussed';

const filterElements = document.body.querySelectorAll('.img-filters__button');
let selectedFilterId = FILTER_DEFAULT_ID;
let selectedFilterElement = document.getElementById(FILTER_DEFAULT_ID);

const filteringPictures = (pictures) => {
  let picturesForRerendering = [];
  switch (selectedFilterId) {
    case FILTER_DEFAULT_ID:
      picturesForRerendering = pictures;
      break;
    case FILTER_DISCUSSED_ID:
      picturesForRerendering = pictures.slice().sort((picture1, picture2) => picture2.comments.length - picture1.comments.length);
      break;
    case FILTER_RANDOM_ID:
      picturesForRerendering = getArrayRandomSample(pictures, RANDOM_PICTURES_COUNT);
      break;
  }
  return picturesForRerendering;
};

const rerenderPictures = (pictures) => {
  const filteredPictures = filteringPictures(pictures);
  document.querySelectorAll('.picture').forEach((picture) => picture.remove());
  renderPicturesList(filteredPictures);
};

const getFilterElementsClickHandler = (cb) => (evt) => {
  selectedFilterId = evt.target.id;
  selectedFilterElement.classList.remove(FILTER_ELEMENT_ACTIVE_CLASS);
  selectedFilterElement = evt.target;
  selectedFilterElement.classList.add(FILTER_ELEMENT_ACTIVE_CLASS);
  cb();
};

getData()
  .then((pictures) => {
    renderPicturesList(pictures);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
    const onFilterElementClick = getFilterElementsClickHandler(debounce(() => rerenderPictures(pictures), TIMEOUT_DELAY));
    filterElements.forEach((filterEl) => filterEl.addEventListener('click', onFilterElementClick));
  })
  .catch((err) => showAlert(err.message));
