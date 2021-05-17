const https = require('https');
const fs = require('fs');

const MAX_CONCURRENT = 5; // Concurrent requests
const MAX_DELAY = 10000; // Max delay between subsequent requests

const PRODUCTS_URL_FILE = './productsUrls'; // AliExpress products URLs
const IMAGES_URL_FILE = './imageUrls'; // Output file

let imagesFileDescriptor = null;
let didFail = false;

const cookie = encodeURIComponent(fs.readFileSync('./cookie').toString());

const stopProcessing = () => {
  urlQueue.length = 0;
  didFail = true;
}

const fetchPage = url => new Promise((resolve, reject) => {
  let page = '';

  // resolve(fs.readFileSync('./req').toString());
  // return

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

const getImageUrl = (page) => {
  fs.writeFileSync('./req', page)
  const imageUrl = page.match(/formatRegex.test\("(.+)"/);
  return imageUrl[1];
}

const saveImageUrlToFile = (imageUrl) => {
  if (!imageUrl) {
    throw new Error('Missing Image URL');
  }
  if (didFail) {
    return;
  }
  fs.appendFileSync(imagesFileDescriptor, `=IMAGE("${imageUrl}", 1)\n`);
}


const handleUrl = async (url) => {
  if (!url) return;

  console.log('Processing...', url);

  try {
    const page = await fetchPage(url);
    const imageUrl = getImageUrl(page);
    saveImageUrlToFile(imageUrl);
    console.log('Done:', url);
  } catch (error) {
    console.log('\x1b[31mFailed handle URL:', url);
    console.log('\nSave the fetched image URLs and try again from where it stopped\n');
    console.error(error);
    stopProcessing();
  }
}

const processNext = async () => {
  if (!urlQueue.length) {
    return;
  }

  const url = urlQueue.shift();
  await handleUrl(url);

  setTimeout(
    processNext,
    Math.floor(Math.random() * MAX_DELAY)
  );
}

const urls = fs.readFileSync(PRODUCTS_URL_FILE).toString();
const urlQueue = urls.split('\n');

fs.open(IMAGES_URL_FILE, 'w', (err, fd) => {
  if (err) throw err;
  imagesFileDescriptor = fd;
  for (let i = 0; i < MAX_CONCURRENT; i++) {
    processNext();
  }
});

// rl.write('https://pt.aliexpress.com/item/1005002382240393.html\n')
