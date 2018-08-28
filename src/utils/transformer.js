const _ = require('lodash');
const { getIp, getCountry } = require('./getters');

const transform = (req, res, extend) => {
  const {
    duration,
    method,
    url,
    route
  } = req;

  const { statusCode: code } = res;
  const bytes = parseInt(res.get('Content-Length') || 0, 10);

  const ip = getIp(req);
  const country = getCountry(ip);

  let tags = {
    type: parseInt(code / 100, 10) | 0,
    method,
    url: route ? route.path : undefined,
    country
  };

  let fields = {
    duration,
    code,
    bytes,
    url,
    method
  };

  if (!extend) {
    return [tags, fields];
  }

  const [extendTags, extendFields] = extend(req, res);

  tags = _.merge(tags, extendTags);

  fields = _.merge(fields, extendFields);

  return [tags, fields];
};

module.exports = transform;
