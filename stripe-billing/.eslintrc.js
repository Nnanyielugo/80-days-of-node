module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['airbnb-base', 'plugin:react/recommended'],
  parser: 'babel-eslint',
  plugins: ['react'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    allowImportExportEverywhere: true,
    ecmaFeature: {
      jsx: true
    }
  },
  rules: {
    'import/no-extraneous-dependencies': 0,
    'no-unused-vars': [1, { 'vars': 'all', 'args': 'none'}],
    'no-underscore-dangle': 0,
    'react/no-find-dom-node': 0,
    'react/no-children-prop': 0,
    'camelcase': 0,
    'implicit-arrow-linebreak': 1,
  },
};
