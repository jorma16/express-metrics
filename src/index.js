const Influx = require('influxdb-nodejs');
const onHeaders = require('on-headers');
const geoip = require('geoip-lite');
const baseConfig = require('./config.base');

module.exports = (config) => {
  if (!config) {
    config = baseConfig;
  }

  const client = new Influx(`http://${config.database.host}:${config.database.port}/${config.database.name}`);
  const { schema } = client;

  client.schema(config.measurement.name, schema);
  client.createDatabase()
    .catch((err) => {
      return console.error('Database creating fails: ', err);
    });

  client.on('writeQueue', async () => {
    if (client.writeQueueLength === config.queueFlush) {
      await client.syncWrite();
    }
  });

  function getCountry(ip) {
    if (ip.indexOf(':') > -1) {
      ip = ip.split(':').pop();
    }

    const geoInfo = geoip.lookup(ip);

    return geoInfo ? geoInfo.country : 'ES';
  }

  function transform(req, res) {
    const duration = req.duration;
    const code = res.statusCode;
    const method = req.method;
    const bytes = parseInt(res.get('Content-Length') || 0, 10);
    const url = req.url;
    const route = req.route.path;
    const referer = req.headers.referer;
    const userEmail = req.user.email;
    const country = getCountry(req.ip);

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
    const start = Date.now();

    onHeaders(res, async () => {
      const mReq = {
        ...req,
        duration: Date.now() - start
      };

      const [tags, fields] = transform(mReq, res);

      try {
        await client.write(config.measurement.name)
        .tag(tags)
        .field(fields);
      } catch (err) {
        console.error(err);
      }
    });

    next();
  };
};
