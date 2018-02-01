const { getIp, getCountry } = require('./getters');

const transform = (req, res) => {
  const {
    duration,
    statusCode: code,
    method,
    url,
    route: {
      path: route
    },
    headers: {
      referer
    }
  } = req;
  const bytes = parseInt(res.get('Content-Length') || 0, 10);

  const ip = getIp(req);
  const country = getCountry(ip);

  const tags = {
    type: parseInt(code / 100, 10) | 0,
    method,
    url: route,
    country
  };

  const fields = {
    duration,
    code,
    bytes,
    url,
    method,
    referer
  };

  return [tags, fields];
};

module.exports = transform;
