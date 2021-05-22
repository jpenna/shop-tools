import fs from 'fs';
import readline from 'readline';
import {
  OUTPUT_INFO_PATH, PRODUCTS_JSON_PATH, NAME_INFO_PATH, SOLD_INFO_PATH, IMAGES_INFO_PATH,
  STORE_INFO_PATH, REVIEWS_INFO_PATH, PRICES_INFO_PATH,
} from './consts.js';

let nameFd = null;
let soldFd = null;
let storeFd = null;
let reviewsFd = null;
let pricesFd = null;
let imagesFd = null;

let lineCount = 1;

const processPrices = (prices) => {
  let minPrice = prices[0];
  let maxPrice = prices[0];
  let minActive = prices[0];
  let maxActive = prices[0];

  for (let i = 1; i < prices.length; i++) {
    const data = prices[i];
    if (data.price < minPrice.price) minPrice = data;
    else if (data.price > maxPrice.price) maxPrice = data;

    if (data.activePrice < minActive.activePrice) minActive = data;
    else if (data.activePrice > maxActive.activePrice) maxActive = data;
  }

  let attributes = '';
  if (minPrice === maxPrice) attributes += `Price: ${minPrice.attributes}\n`;
  else attributes += `Min: ${minPrice.attributes}\nMax: ${maxPrice.attributes}\n`;

  if (minActive === maxActive) attributes += `Active: ${minActive.attributes}\n`;
  else attributes += `Active -: ${minActive.attributes}\nActive +: ${maxActive.attributes}\n`;

  return `"${attributes}",${minPrice.price},${maxPrice.price},${minActive.activePrice},${maxActive.activePrice}\n`;
};

const processLine = (line) => {
  const json = JSON.parse(line);

  logger.log(`Processing ${lineCount++}: ${json.id}`);

  const prices = processPrices(json.prices);
  fs.appendFileSync(pricesFd, prices);

  fs.appendFileSync(nameFd, `${json.title}\n`);
  fs.appendFileSync(soldFd, `${json.tradeCount}\n`);

  const image = json.imageUrl ? `=IMAGE("${json.imageUrl}", 1)` : '';
  fs.appendFileSync(imagesFd, `${image}\n`);

  const reviews = json.reviews.product.stars.reduce((acc, rate, index) => {
    return `${acc}\n(${index}): ${rate}`;
  });
  fs.appendFileSync(reviewsFd, `"${reviews}"\n`);

  const { since = '', positiveCount = '', positiveRate = '', isTopSeller, yearsOld = '' } = json.reviews.store;
  const storeData = `"${isTopSeller ? 'TOP SELLER\n' : ''}Since: ${since}
Years: ${yearsOld}
Positive: ${positiveCount} (${positiveRate})"\n`;
  fs.appendFileSync(storeFd, storeData);
};

export const run = () => {
  fs.mkdir(OUTPUT_INFO_PATH, () => {
    nameFd = fs.openSync(NAME_INFO_PATH, 'w+');
    soldFd = fs.openSync(SOLD_INFO_PATH, 'w+');
    storeFd = fs.openSync(STORE_INFO_PATH, 'w+');
    reviewsFd = fs.openSync(REVIEWS_INFO_PATH, 'w+');
    pricesFd = fs.openSync(PRICES_INFO_PATH, 'w+');
    imagesFd = fs.openSync(IMAGES_INFO_PATH, 'w+');

    const readInterface = readline.createInterface({
      input: fs.createReadStream(PRODUCTS_JSON_PATH),
    });
    readInterface.on('line', processLine);
  });
};
