import fs from 'fs';
import {
  OUTPUT_PATH, MAX_CONCURRENT, PRICES_URL_PATH, IMAGES_URL_PATH,
} from './consts.js';

export const run = () => {
  fs.mkdir(OUTPUT_PATH, () => {
    if (scope === 'prices' || !scope) {
      pricesFd = fs.openSync(PRICES_URL_PATH, 'w+');
    }

    if (scope === 'images' || !scope) {
      imagesFd = fs.openSync(IMAGES_URL_PATH, 'w+');
    }

    if (pricesFd || imagesFd) {
      for (let i = 0; i < MAX_CONCURRENT; i++) {
        processNext(handler, fetchPage);
      }
    } else {
      throw new Error('Acceptable scopes are only `prices` or `images` or nothing');
    }
  });
};
