import https from 'https';
import fs from 'fs';
import { COOKIE_PATH, SAMPLE_FREIGHT_PATH, SAMPLE_PAGE_PATH } from './consts.js';

const cookie = encodeURIComponent(fs.readFileSync(COOKIE_PATH).toString());

const fetch = (url, optHeaders = {}) => new Promise((resolve, reject) => {
  if (!url) return;

  let content = '';

  https.get(url, { headers: { cookie, ...optHeaders } }, (res) => {
    res.on('data', (d) => {
      content += d;
    });

    res.on('end', () => resolve(content));
  }).on('error', (error) => {
    console.log(`Failed fetching page ${url}`);
    console.error(error);
    reject();
  });
});

export const fetchPage = (url) => {
  // return new Promise((res) => setTimeout(() => {
//   res(fs.readFileSync(SAMPLE_PAGE_PATH).toString());
// }, Math.random() * 1000);

  return fetch(url);
};

export const fetchFreight = async (url, referer) => {
  // return new Promise((res) => setTimeout(() => {
  //   res(JSON.parse(fs.readFileSync(SAMPLE_FREIGHT_PATH).toString()));
  // }, Math.random() * 1000));

  const response = await fetch(url, { referer });
  return JSON.parse(response);
};
