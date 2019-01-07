const {ifAnyDep} = require('../utils');

module.exports = {
  env: {
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    ifAnyDep('react', 'plugin:react/recommended'),
    ifAnyDep('react', 'plugin:jsx-a11y/recommended')
  ].filter(Boolean),
  rules: {}
};
