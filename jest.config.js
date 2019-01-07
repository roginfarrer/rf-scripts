const jestConfig = require('./src/config/jest.config.js');

module.exports = Object.assign(jestConfig, {
  coverageThreshold: null
});
