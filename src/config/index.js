module.exports = {
  babel: require('./babelrc'),
  eslint: require('./eslintrc'),
  jest: require('./jest.config'),
  prettier: require('./prettier.config'),
  getRollupConfig: () => require('./rollup.config')
};
