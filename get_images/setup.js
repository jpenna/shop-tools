import { OPTION_SELECTED_IDS, OPTION_USE_LOCAL } from './src/consts.js';

if (process.argv[3] === 'local') {
  global[OPTION_USE_LOCAL] = true;
}

process.argv.forEach((arg, index) => {
  if (arg === 'id') {
    const opt = process.argv[index + 1];
    if (!global[OPTION_SELECTED_IDS]) {
      global[OPTION_SELECTED_IDS] = [];
    }
    global[OPTION_SELECTED_IDS].push(opt);
  }
});

global.logger = {
  log: console.log,
  error: console.error,
};
