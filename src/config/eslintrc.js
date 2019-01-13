const {ifAnyDep} = require('../utils');

module.exports = {
  extends: [
    require.resolve('eslint-config-kentcdodds'),
    require.resolve('eslint-config-kentcdodds/jest'),
    ifAnyDep('react', require.resolve('eslint-config-kentcdodds/jsx-a11y')),
    ifAnyDep('react', require.resolve('eslint-config-kentcdodds/react'))
  ].filter(Boolean),
  rules: {
    'react/no-did-mount-set-state': 'off',
    'react/default-props-match-prop-types': [
      'error',
      {allowRequiredDefaults: true}
    ]
  }
};
