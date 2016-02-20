var logger = require('morgan');
var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var app = express();

app.engine('.hbs', exphbs({extname: '.hbs'}));

app.set('port', (process.env.PORT || 5000));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', require('./routes/index'));
app.use('/api', require('./routes/tips'));

app.use(function(req, res, next) {
  var err = new Error('forse non esiste');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;