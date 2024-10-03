module.exports = {
  ignorePatterns: ['eslint.config.js', 'node_modules/'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: ['airbnb-base'],
  rules: {
    'arrow-body-style': ['error', 'always'],
  },
};
