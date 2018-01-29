# Express metrics
With this project you can connect your express application with influxdb and render a dashboard in grafana.

## Config example
```
{
  measurement: {
    name: 'express'
  },
  schema: {
    duration: 'integer',
    code: 'integer',
    bytes: 'integer',
    url: 'string',
    domain: 'string',
    referer: 'string',
    userEmail: 'string'
  },
  database: {
    host: 'localhost',
    port: 8086,
    name: 'nodejs'
  },
  queueFlush: 100
}
```
### options
- measurement:
  - name: (string) the name of the influx metric
- schema: (object) the default schema is better, I do not recommend to modify this
- database:
  - host: (string) the host of influxdb
  - port: (integer) the port of influxdb
  - name: (string) the name of the database in influxdb
- queueFlush: (integer) the number to events to store before flush (only in sync mode)
