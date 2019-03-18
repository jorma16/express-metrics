const onHeaders = require('on-headers');
const { setConfig } = require('./utils/config');
const Influx = require('./utils/db');
const transform = require('./utils/transformer');

let db;
let config;

module.exports = (configuration, customTransform) => {
  config = setConfig(configuration);

  db = new Influx(config);
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

      const [tags, fields] = transform(mReq, res, customTransform);

      try {
        await db.client.write(config.measurement.name)
          .tag(tags)
          .field(fields);
      } catch (error) {
        throw error;
      }
    });

    next();
  };
};

module.exports.write = (tags, fields) => {
  tags = Object.entries(tags).reduce((obj, [key, value]) => {
    if (value === '') {
      return obj;
    }

    obj[key] = value;

    return obj;
  }, {});

  return db.client.write(config.measurement.name).tag(tags).field(fields);
};
