const _ = require('lodash');
const { getIp, getCountry, getUserAgent } = require('./getters');

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
  const userAgent = getUserAgent(req);

  let tags = {
    type: parseInt(code / 100, 10) | 0,
    method,
    route: route ? route.path : undefined,
    country,
    ip,
    userAgent
  };

  let fields = {
    duration,
    code,
    bytes,
    url,
    method,
    ip,
    userAgent
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
