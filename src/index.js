const onHeaders = require('on-headers');
const { setConfig } = require('./utils/config');
const Influx = require('./utils/db');
const { getIp, getCountry } = require('./utils/getters');

module.exports = (config) => {
  config = setConfig(config);

  const db = new Influx(config);
  db.initializeDb();

  function transform(req, res) {
    const duration = req.duration;
    const code = res.statusCode;
    const method = req.method;
    const bytes = parseInt(res.get('Content-Length') || 0, 10);
    const url = req.url;
    const route = req.route.path;
    const referer = req.headers.referer;
    const userEmail = req.user ? req.user.email : null;
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
      referer,
      userEmail
    };

    return [tags, fields];
  }

  return (req, res, next) => {
    const userAgent = req.headers['user-agent'];
    if (config.blackList.indexOf(userAgent) > -1) {
      return next();
    }

    const start = Date.now();

    onHeaders(res, async () => {
      const mReq = {
        ...req,
        duration: Date.now() - start
      };

      const [tags, fields] = transform(mReq, res);

      try {
        await db.client.write(config.measurement.name)
        .tag(tags)
        .field(fields);
      } catch (err) {
        console.error(err);
      }
    });

    next();
  };
};
