import {renderPictures} from './draw-pictures.js';
import {getData} from './api.js';
import {showAlert, getArrayRandomSample, debounce} from './util.js';

const TIMEOUT_DELAY = 500;
const RANDOM_PICTURES_COUNT = 10;
const FILTER_ELEMENT_ACTIVE_CLASS = 'img-filters__button--active';
const FILTER_DEFAULT_ID = 'filter-default';
const FILTER_RANDOM_ID = 'filter-random';
const FILTER_DISCUSSED_ID = 'filter-discussed';

let selectedFilterId = FILTER_DEFAULT_ID;
let selectedFilterElement = document.getElementById(FILTER_DEFAULT_ID);

const getFilteredPictures = (pictures) => {
  switch (selectedFilterId) {
    case FILTER_DEFAULT_ID:
      return pictures;
    case FILTER_DISCUSSED_ID:
      return pictures.slice().sort((picture1, picture2) => picture2.comments.length - picture1.comments.length);
    case FILTER_RANDOM_ID:
      return getArrayRandomSample(pictures, RANDOM_PICTURES_COUNT);
  }
};

getData()
  .then((pictures) => {
    renderPictures(pictures);
    const onFilterElementClick = debounce((evt) => {
      if (evt.target.classList.contains('img-filters__button')) {
        selectedFilterElement.classList.remove(FILTER_ELEMENT_ACTIVE_CLASS);
        selectedFilterId = evt.target.id;
        selectedFilterElement = evt.target;
        selectedFilterElement.classList.add(FILTER_ELEMENT_ACTIVE_CLASS);
        renderPictures(getFilteredPictures(pictures));
      }
    }, TIMEOUT_DELAY);
    document.querySelector('.img-filters').addEventListener('click', onFilterElementClick);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  })
  .catch((err) => showAlert(err.message));
