# Express metrics
With this project you can connect your express application with influxdb and render a dashboard in grafana.

By default it gather a classic group of parameters, like request duration, code, bytes, url, domain and referer. It also allow you to create custom functions to gather other metrics.

You can install this with `npm i mtrics-express` and see in [npm](https://www.npmjs.com/package/mtrics-express)

## Basic use
You can easily add this module as a middleware of your express app, without any config, only naming your metric for example with the name of your project. You can go to the `examples/basic` folder to see an example.

## Advanced use
If you need more funcionality, you can go to `examples/custom-config` to see an example of an advanced use of the library to extends the metrics gathered by the middleware. Yo need to specify in your config file the schema of the measurement and your custom transform function needs to receive as params the request and the response, and needs to return an array with `[tags, fields]` as objects.

### Example of custom config file
```
module.exports = {
  measurement: {
    name: 'express'
  },
  schema: {
    userEmail: 'string'
  }
};
```
Here we can see that the name of the measurement is `express` and the extended schema accemts a new field named userEmail and his type is `string` it allows more types like:
- float (f)
- boolean (b)
- integer (i)
- string (s)

```
const influx = require('../../src')(config, (req, res) => {
  return [{}, { userEmail: req.user }];
});

const app = express();
app.use(influx);
```
Here we can see how to configure our express application, for example passing the previous config file and adding a transform function that returns an array with an empty object as extended tags and an object with our new metric in the fields object.

## Requeriments
This library is thought to be used with an influxDb database and a grafana dashboard to paint the metrics is included in the project in the `dashboard.json` file, ready to be imported.

## Dependencies
This library uses:
- geoip-lite 1.2.1: To geolocalize the ip directions and be able to draw on a map.
- influxdb-nodejs 2.7.6: Connectivity layer with influx
- on-headers 1.0.1: Easily manage the response just before we send it.
- lodash 4.17.4: Utility library
## Contributions
This project exists thanks to the following people and enterprises:
- [Avantio](https://github.com/Avantio-ITS)
- [Artem Molonosov](https://github.com/ti0ma)
- [David Bayo](https://github.com/davidbayo10)

