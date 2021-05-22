import fs from 'fs';
import { OUTPUT_PATH, FREIGHT_PATH, SELECTED_FREIGHT_PATH } from './consts.js';
import { fetchFreight } from './fetch.js';
import { flags, startProcessing } from './process.js';

let allFrightsFd = null;
let selectedFrightFd = null;

const fetcher = (url) => {
  const matched = url.match(/item\/(\d+)\./);
  const productId = matched[1];
  const freightUrl = `https://pt.aliexpress.com/aeglodetailweb/api/logistics/freight?productId=${productId}&count=1&sendGoodsCountry=CN&country=BR&tradeCurrency=BRL`;
  return fetchFreight(freightUrl, url);
};

const handler = (freightData) => {
  if (!flags.continue) return;

  let selected = 99999999;

  const allFreightsString = freightData.body.freightResult.map((data) => {
    // In USD
    if (data.freightAmount.value < selected) {
      selected = data.freightAmount.value;
    }
    return `${data.time}: ${data.freightAmount.formatedAmount} (${data.company})`;
  }).join('\n');

  fs.appendFileSync(allFrightsFd, `"${allFreightsString}"\n`);
  fs.appendFileSync(selectedFrightFd, `${selected}\n`);
};

export const run = () => {
  fs.mkdir(OUTPUT_PATH, () => {
    allFrightsFd = fs.openSync(FREIGHT_PATH, 'w+');
    selectedFrightFd = fs.openSync(SELECTED_FREIGHT_PATH, 'w+');
    startProcessing(handler, fetcher);
  });
};
