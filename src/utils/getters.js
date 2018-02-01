const geoip = require('geoip-lite');

const getIp = (req) => {
  let ip = req.ip;
  if (!ip) {
    [ip] = req.headers['x-forwarded-for'].split(',');
  }

  return ip;
};

const getCountry = (ip) => {
  if (ip.indexOf(':') > -1) {
    [ip] = ip.split(':');
  }

  const { country } = geoip.lookup(ip);
  return country;
};

module.exports = { getIp, getCountry };
