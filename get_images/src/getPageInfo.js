const fs = require('fs');
const { fetchPage } = require('./fetch');
const { buildJSON } = require('./helpers');
const { processNext, flags } = require('./process');

const MAX_CONCURRENT = 5; // Concurrent requests

const OUTPUT_PATH = 'src/output'; // Output folder
const IMAGES_URL_PATH = `${OUTPUT_PATH}/imageUrls`; // Output image file
const PRICES_URL_PATH = `${OUTPUT_PATH}/prices`; // Output prices file

let imagesFd = null;
let pricesFd = null;

const getImageUrl = (page) => {
  const imageUrl = page.match(/formatRegex.test\("(.+)"/);
  return imageUrl[1];
}

const saveImageUrlToFile = (imageUrl) => {
  if (!flags.continue) {
    return;
  }
  const line = imageUrl ? `=IMAGE("${imageUrl}", 1)\n` : '\n';
  fs.appendFileSync(imagesFd, line);
}

const getPrices = (page) => {
  const priceJSON = buildJSON(page, '"priceModule":{');
  const price = priceJSON.formatedPrice;
  const activityPrice = priceJSON.formatedActivityPrice;

  return [price, activityPrice];
}

const savePricesToFile = (prices) => {
  if (!flags.continue) {
    return;
  }

  const pricesString = prices
    .map((price = '') =>
      price.replace('R$ ', '')
        .replace(/,/g, '.') // Use dot cents
        .replace(' - ', ',') // Min, max
    )
    .join(',');

  fs.appendFileSync(pricesFd, `${pricesString}\n`);
}

const handler = async (page) => {
  if (imagesFd) {
    const imageUrl = getImageUrl(page);
    saveImageUrlToFile(imageUrl);
  }

  if (pricesFd) {
    const prices = getPrices(page);
    savePricesToFile(prices);
  }
}

// RUN
const run = (scope) => {
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
}

module.exports = {
  run
}
