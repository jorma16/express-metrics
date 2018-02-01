const InfluxDB = require('influxdb-nodejs');

class Influx {
  constructor(config) {
    this.config = config;
    this.client = new InfluxDB(`http://${config.database.host}:${config.database.port}/${config.database.name}`);
  }

  async initializeDb() {
    const { measurement: { name }, schema } = this.config;
    this.client.schema(name, schema);
    try {
      await this.client.createDatabase();
      this.client.on('writeQueue', async () => {
        if (this.client.writeQueueLength === this.config.queueFlush) {
          await this.client.syncWrite();
        }
      });
    } catch (err) {
      console.error('Database creating fails: ', err);
    }
  }
}

module.exports = Influx;
