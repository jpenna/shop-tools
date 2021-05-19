import https from 'https';
import fs from 'fs';
import { COOKIE_PATH, SAMPLE_PAGE_PATH } from './consts.js';

const cookie = encodeURIComponent(fs.readFileSync(COOKIE_PATH).toString());

export const fetchPage = (url) => new Promise((resolve, reject) => {
  if (!url) return;

  let page = '';

  setTimeout(() => {
    resolve(fs.readFileSync(SAMPLE_PAGE_PATH).toString());
  }, Math.random() * 1000);
  return;

  https.get(url, { headers: { cookie } }, (res) => {
    res.on('data', (d) => {
      page += d;
    });

    res.on('end', () => resolve(page));
  }).on('error', (error) => {
    console.log(`Failed fetching page ${url}`);
    console.error(error);
    reject();
  });
});
