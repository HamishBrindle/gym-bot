module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'jsdoc',
  ],
  extends: [
    'airbnb-typescript/base',
    'plugin:jsdoc/recommended',
  ],
  rules: {
    'class-methods-use-this': 'off',
    'import/no-cycle': 'off',
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',

    // JSDoc
    'jsdoc/require-param-description': 0, // Too annoying
    'jsdoc/require-param-type': 0, // TypeScript takes care of this
    'jsdoc/require-returns-type': 0, // TypeScript takes care of this
    'jsdoc/require-returns': 0, // TypeScript takes care of this
  },
};