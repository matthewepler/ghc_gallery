var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var morgan = require('morgan');
var csurf = require('csurf');

// Twilio Config
var config = require('./twilioConfig');
var twilioNotifications = require('./middleware/twilioNotifications');

// Use morgan for HTTP request logging in dev and prod
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// using webpack-dev-server and middleware in development environment
if(process.env.NODE_ENV !== 'production') {
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpack = require('webpack');
  var config = require('./webpack.config');
  var compiler = webpack(config);
  
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(path.join(__dirname, 'dist')));

// Parse incoming form-encoded HTTP bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

// Create and manage HTTP sessions for all requests
app.use(session({
  secret: process.env.APP_SECRET,
  resave: true,
  saveUninitialized: true
}));

// Use connect-flash to persist informational messages across redirects
app.use(flash());

// Mount middleware to notify Twilio of errors
app.use(twilioNotifications.notifyOnError);


// ROUTES
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

app.post('/', function(req, res) {
  console.log(req.body.text1);
  res.redirect('/');
});


var PORT = process.env.PORT || 8080
app.listen(PORT, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  }
});

module.exports = app;