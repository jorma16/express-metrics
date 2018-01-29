module.exports = {
  measurement: {
    name: 'express'
  },
  schema: {
    duration: 'integer',
    code: 'integer',
    bytes: 'integer',
    url: 'string'
  },
  database: {
    host: 'localhost',
    port: 8086,
    name: 'nodejs'
  },
  queueFlush: 100
};
