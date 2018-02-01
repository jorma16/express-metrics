const _ = require('lodash');
const baseConfig = require('../config.base');

const setConfig = (config) => {
  return _.merge(baseConfig, config);
};

module.exports = {
  setConfig
};
