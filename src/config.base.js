module.exports = {
  measurement: {
    name: 'express'
  },
  schema: {
    duration: 'integer',
    code: 'integer',
    bytes: 'integer',
    url: 'string',
    domain: 'string'
  },
  database: {
    host: 'localhost',
    port: 8086,
    name: 'nodejs'
  },
  blackList: [],
  queueFlush: 100
};
