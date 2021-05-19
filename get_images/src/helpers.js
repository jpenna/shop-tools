const assert = require('assert');

const buildJSON = (text, objectInit) => {
  if (!text) return {};

  const init = text.indexOf(objectInit);
  if (init < 0) return {};

  let count = 1;
  let pos = init + objectInit.length;
  do {
    const char = text[pos];

    if (char === '{') count++;
    else if (char === '}') count--;

    pos++;
  } while (count > 0 && text[pos] !== undefined);

  return count > 0
    ? {}
    : JSON.parse(text.substring(init + objectInit.length - 1, pos));
}

module.exports = {
  buildJSON
}

// const validText = '"astring":{"build":123, "h":[123, 43, 123], "123":{"oi": "hey"}},"other"stuff}';
// assert.deepStrictEqual(buildJSON(validText, '"astring":{'), {"build":123, "h":[123, 43, 123], '123':{"oi": "hey"}});
