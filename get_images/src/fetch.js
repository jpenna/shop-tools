const https = require('https');
const fs = require('fs');

const COOKIE_PATH = 'src/input/cookie';

const SAMPLE_PAGE_PATH = 'src/samples/page.html';
const SAMPLE_FREIGHT_PATH = 'src/samples/freight.json';

const cookie = encodeURIComponent(fs.readFileSync(COOKIE_PATH).toString());

const fetchPage = url => new Promise((resolve, reject) => {
  if (!url) return;

  let page = '';

  setTimeout(() => {
    resolve(fs.readFileSync(SAMPLE_PAGE_PATH).toString());
  }, Math.random() * 1000);
  return;

  https.get(url, { headers: { cookie } }, res => {
    res.on('data', d => {
      page += d;
    });

    res.on('end', () => resolve(page));
  }).on('error', error => {
    console.log(`Failed fetching page ${url}`);
    console.error(error);
    reject();
  })
});

module.exports = {
  fetchPage
}
