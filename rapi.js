const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const config = require('./config');
const bodyParser = require('body-parser');

mongoose.connect(config.mongoUri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res) => {
    res.status(404).send({url: req.originalUrl + ' not found'})
  });

const routes = require('./todoListRoutes'); //importing route
routes(app);

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);
