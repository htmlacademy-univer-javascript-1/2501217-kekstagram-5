import {renderPictures} from './draw-pictures.js';
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

const getFilteredPictures = (pictures) => {
  let filteredPictures = [];
  switch (selectedFilterId) {
    case FILTER_DEFAULT_ID:
      filteredPictures = pictures;
      break;
    case FILTER_DISCUSSED_ID:
      filteredPictures = pictures.slice().sort((picture1, picture2) => picture2.comments.length - picture1.comments.length);
      break;
    case FILTER_RANDOM_ID:
      filteredPictures = getArrayRandomSample(pictures, RANDOM_PICTURES_COUNT);
      break;
  }
  return filteredPictures;
};

const rerenderPictures = (pictures) => {
  const filteredPictures = getFilteredPictures(pictures);
  document.querySelectorAll('.picture').forEach((picture) => picture.remove());
  renderPictures(filteredPictures);
};

const getFilterElementClickHandler = (cb) => (evt) => {
  selectedFilterId = evt.target.id;
  selectedFilterElement.classList.remove(FILTER_ELEMENT_ACTIVE_CLASS);
  selectedFilterElement = evt.target;
  selectedFilterElement.classList.add(FILTER_ELEMENT_ACTIVE_CLASS);
  cb();
};

getData()
  .then((pictures) => {
    renderPictures(pictures);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
    const onFilterElementClick = getFilterElementClickHandler(debounce(() => rerenderPictures(pictures), TIMEOUT_DELAY));
    filterElements.forEach((filterElement) => filterElement.addEventListener('click', onFilterElementClick));
  })
  .catch((err) => showAlert(err.message));
