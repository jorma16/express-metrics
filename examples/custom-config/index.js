const express = require('express');
const _ = require('lodash');
const config = require('./config');
const influx = require('../../src')(config, (req, res) => {
  return [{}, { userEmail: req.user }];
});

const app = express();
app.use(influx);

app.use((req, res, next) => {
  req.user = 'developer@developer.com';
  setTimeout(next, _.random(0, 2000));
});

app.get('/users/me', (req, res) => {
  res.send({
    account: 'me',
    name: 'My user'
  });
});

app.get('/booking/:id', (req, res) => {
  const { id } = req.params;
  res.send({
    id,
    name: 'Booking example'
  });
});

app.get('/order/:id', (req, res) => {
  res.status(400).send({
    msg: 'The id is not valid'
  });
});

app.get('/checkout/:id', (req, res) => {
  res.status(500).send({
    msg: 'Connection to database failed'
  });
});

app.listen(process.env.PORT || 8989, () => {
  console.info(`Listening on http://127.0.0.1:${process.env.PORT || 8989}/`);
});
