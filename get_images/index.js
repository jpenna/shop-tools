const arg = process.argv[2];

if (arg === 'prices' || arg === 'images' || arg === 'pages') {
  const getPageInfo = require('./src/getPageInfo');
  getPageInfo.run(arg === 'pages' ? null : arg);
  return;
}

if (arg === 'freight') {
  const getFreight = require('./src/getFreight');
  getFreight.run();
  return;
}

throw new Error('Acceptable arguments are only `prices` or `images`');
