module.exports = {
  extends: [
    'airbnb-base',
    'plugin:import/recommended',
    'plugin:node/recommended',
    'plugin:jsdoc/recommended',
    'plugin:jest/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'import/no-unresolved': 'off',
    'node/no-missing-require': 'off',
    'max-classes-per-file': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
