import {renderPicturesList} from './draw-pictures.js';
import {getData} from './api.js';
import { showAlert } from './util.js';

getData()
  .then((pictures) => renderPicturesList(pictures))
  .catch((err) => showAlert(err.message));
