module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser',
  },
  rules: {
    // TypeScript
    '@typescript-eslint/camelcase': ['off'],
    '@typescript-eslint/ban-ts-ignore': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-var-requires': ['off'],
    '@typescript-eslint/interface-name-prefix': ['error', {
      prefixWithI: 'always',
    }],

    // Vue
    'vue/no-v-html': 'off',

    // General
    'lines-between-class-members': ['error', 'always'],
    'keyword-spacing': ['error', { 'before': true }],
    'semi': ['error', 'always'],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'camelcase': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'class-methods-use-this': 'off',
    'import/extensions': 'off',
    'import/no-named-as-default': 'off',
    'max-len': 'off', // TODO: Put this shit back on you lazy ass fucks
    'no-trailing-spaces': 'error',
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
  globals: {
    _: 'readonly',
  }
};
