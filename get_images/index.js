import './setup.js';
import * as getPageInfo from './src/getPageInfo.js';
import * as getFreight from './src/getFreight.js';
import * as processFields from './src/processFields.js';

const choice = process.argv[2];

switch (choice) {
  case 'info':
    getPageInfo.run();
    break;
  case 'freight':
    getFreight.run();
    break;
  case 'fields':
    processFields.run();
    break;
  default:
    throw new Error('Argument is required: info, freight, fields');
}
