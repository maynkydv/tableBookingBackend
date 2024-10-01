const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

module.exports = [
  ...compat.extends('airbnb-base'),
  {
    rules: {
      'arrow-body-style': ['error', 'always'],
    },
  },
];
