import * as getPageInfo from './src/getPageInfo.js';
import * as getFreight from './src/getFreight.js';

const arg = process.argv[2];

switch (arg) {
  case 'prices':
  case 'images':
  case 'prices-images':
    getPageInfo.run(arg === 'prices-images' ? null : arg);
    break;
  case 'freight':
    getFreight.run();
    break;
  default:
    throw new Error('Argument is required: prices, images, prices-images, freight');
}
