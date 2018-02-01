const onHeaders = require('on-headers');
const { setConfig } = require('./utils/config');
const Influx = require('./utils/db');
const transform = require('./utils/transformer');

module.exports = (config) => {
  config = setConfig(config);

  const db = new Influx(config);
  db.initializeDb();

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
