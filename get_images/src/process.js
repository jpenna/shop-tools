import fs from 'fs';
import { PRODUCTS_URL_PATH, MAX_DELAY } from './consts.js';

const urls = fs.readFileSync(PRODUCTS_URL_PATH).toString();
const urlQueue = urls.split('\n');

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

export const processNext = async (handler, fetcher) => {
  if (!urlQueue.length || !flags.continue) {
    return;
  }
  const myTurn = turn++;

  const url = urlQueue.shift();

  console.log(`Starting ${myTurn}...`, url);

  try {
    const page = await fetcher(url);

    await processInTurn(myTurn, handler, page);
    currentTurn = myTurn + 1;
  } catch (error) {
    console.log('\x1b[31mFailed handle URL:', url);
    console.log('\nSave the fetched stuff and try again from where it stopped\n');
    console.error(error);
    flags.continue = false;
  }

  console.log(`Done ${myTurn}:`, url);

  setTimeout(
    () => processNext(handler, fetcher),
    Math.floor(Math.random() * MAX_DELAY),
  );
};
