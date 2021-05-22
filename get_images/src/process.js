import fs from 'fs';
import { PRODUCTS_URL_PATH, MAX_DELAY, MAX_CONCURRENT, OPTION_SELECTED_IDS, OPTION_USE_LOCAL } from './consts.js';

const urls = fs.readFileSync(PRODUCTS_URL_PATH).toString();
let urlQueue = urls.split('\n');
if (global[OPTION_SELECTED_IDS]) {
  urlQueue = global[OPTION_SELECTED_IDS]
    .map((id) => `https://pt.aliexpress.com/item/${id}.html`);
}

let turn = 1;
let currentTurn = 1;
export const flags = { continue: true };

const processInTurn = async (myTurn, handler, page) => {
  if (myTurn === currentTurn) {
    return handler(page);
  }

  return new Promise((res) => {
    setTimeout(() => {
      res(processInTurn(myTurn, handler, page));
    }, 500);
  });
};

const processNext = async (handler, fetcher) => {
  if (!urlQueue.length || !flags.continue) {
    return;
  }
  const myTurn = turn++;

  const url = urlQueue.shift();
  if (!url) return;

  logger.log(`Starting ${myTurn}...`, url);

  try {
    const page = await fetcher(url);

    await processInTurn(myTurn, handler, page);
    currentTurn = myTurn + 1;
  } catch (error) {
    logger.log('\x1b[31mFailed handle URL:', url);
    logger.log('\nSave the fetched stuff and try again from where it stopped\n');
    logger.error(error);
    flags.continue = false;
  }

  logger.log(`Done ${myTurn}:`, url);

  setTimeout(
    () => processNext(handler, fetcher),
    global[OPTION_USE_LOCAL]
      ? 0
      : Math.floor(Math.random() * MAX_DELAY),
  );
};

export const startProcessing = (handler, fetchPage) => {
  for (let i = 0; i < MAX_CONCURRENT; i++) {
    processNext(handler, fetchPage);
  }
};
