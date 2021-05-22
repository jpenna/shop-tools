import https from 'https';
import fs from 'fs';
import { COOKIE_PATH, FULL_PAGE_INFO_PATH, OPTION_USE_LOCAL,
} from './consts.js';

let cookie;
if (!global[OPTION_USE_LOCAL]) {
  cookie = encodeURIComponent(fs.readFileSync(COOKIE_PATH).toString());
}

const fetch = (url, optHeaders = {}) => new Promise((resolve, reject) => {
  if (!url) return;

  let content = '';

  https.get(url, { headers: { cookie, ...optHeaders } }, (res) => {
    res.on('data', (d) => {
      content += d;
    });

    res.on('end', () => resolve(content));
  }).on('error', (error) => {
    logger.log(`Failed fetching page ${url}`);
    logger.error(error);
    reject();
  });
});

export const fetchPage = (url) => {
  if (global[OPTION_USE_LOCAL]) {
    return new Promise((res) => {
      const itemId = url.match(/\/item\/(\d+)\./)[1];
      fs.readFile(
        `${FULL_PAGE_INFO_PATH}/${itemId}.json`,
        (err, data) => res(`data: ${data}`),
      );
    });
  }

  return fetch(url);
};

export const fetchFreight = async (url, referer) => {
  const response = await fetch(url, { referer });
  return JSON.parse(response);
};
