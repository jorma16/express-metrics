const _ = require('lodash');
const baseConfig = require('../config.base');

const setConfig = (config) => _.merge(baseConfig, config);

module.exports = {
  setConfig
};
