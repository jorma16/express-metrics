const geoip = require('geoip-lite');

const getIp = (req) => {
  let ip = req.ip;
  if (!ip && req.headers['x-forwarded-for']) {
    [ip] = req.headers['x-forwarded-for'].split(',');
  }

  if (!ip) {
    ip = '127.0.0.1';
  }

  return ip.trim();
};

const getCountry = (ip) => {
  if (ip.indexOf(':') > -1) {
    [ip] = ip.split(':');
  }

  const geo = geoip.lookup(ip);
  if (geo) {
    return geo.country;
  }

  return 'ES';
};

module.exports = { getIp, getCountry };
