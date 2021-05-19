module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-plusplus': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': ['error', 'always'],
    'no-console': 'off',
  },
};
