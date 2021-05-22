import fs from 'fs';
import { OUTPUT_PATH, PRODUCTS_JSON_PATH, FULL_PAGE_INFO_PATH } from './consts.js';
import { fetchPage } from './fetch.js';
import { buildJSON } from './helpers.js';
import { startProcessing, flags } from './process.js';

let infoFd = null;

const writeJSONToFile = (json) => {
  if (!flags.continue) {
    return;
  }

  fs.appendFileSync(infoFd, `${JSON.stringify(json)}\n`);
};

const getPrices = (pageInfo) => {
  const hasFreightAttr = pageInfo.skuModule.productSKUPropertyList
    .some((prop) => prop.skuPropertyId === 200007763);

  const list = hasFreightAttr
    ? pageInfo.skuModule.skuPriceList
      .filter((priceData) => priceData.skuAttr.includes('200007763:201336100')
        || priceData.skuAttr.includes('200007763:201441035'))
    : pageInfo.skuModule.skuPriceList;

  return list.map((priceData) => {
    const matches = priceData.skuAttr.matchAll(/:#?(.+);?/g);
    const attributes = Array
      .from(matches, (match) => match[1])
      .join(' | ')
      .replace('200007763:201336100', '')
      .replace('200007763:201441035', '');
    return {
      attributes,
      activePrice: (priceData.skuVal.skuActivityAmount?.value ?? priceData.skuVal.skuAmount.value),
      price: priceData.skuVal.skuAmount.value,
    };
  });
};

const handler = async (page) => {
  const pageInfo = buildJSON(page, 'data: {');
  const data = {
    id: pageInfo.pageModule.productId,
    imageUrl: pageInfo.imageModule.imagePathList[0],
    title: pageInfo.titleModule.subject,
    prices: getPrices(pageInfo),
    tradeCount: pageInfo.titleModule.tradeCount,
    reviews: {
      product: {
        stars: [
          pageInfo.titleModule.feedbackRating.averageStar,
          pageInfo.titleModule.feedbackRating.oneStarNum,
          pageInfo.titleModule.feedbackRating.twoStarNum,
          pageInfo.titleModule.feedbackRating.threeStarNum,
          pageInfo.titleModule.feedbackRating.fourStarNum,
          pageInfo.titleModule.feedbackRating.fiveStarNum,
        ],
      },
      store: {
        since: pageInfo.storeModule.openTime,
        yearsOld: pageInfo.storeModule.openedYear,
        positiveCount: pageInfo.storeModule.positiveNum,
        positiveRate: pageInfo.storeModule.positiveRate,
        isTopSeller: pageInfo.storeModule.topRatedSeller,
      },
    },
  };

  fs.writeFileSync(`${FULL_PAGE_INFO_PATH}/${data.id}.json`, JSON.stringify(pageInfo, null, 2));
  writeJSONToFile(data);
};

// RUN
export const run = () => {
  fs.mkdir(OUTPUT_PATH, () => {
    infoFd = fs.openSync(PRODUCTS_JSON_PATH, 'w+');

    if (infoFd) {
      startProcessing(handler, fetchPage);
    } else {
      throw new Error('Couldn\'t open file');
    }
  });
};
