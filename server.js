var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var morgan = require('morgan');
var csurf = require('csurf');
var firebase = require('firebase');

// view engine setup
app.set('views', __dirname + '/src/components');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

// Twilio Config
var config = require('./twilioConfig');
var twilioNotifications = require('./middleware/twilioNotifications');
var twilio = require('./twilioClient');

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
app.use(bodyParser.json());

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

app.post('/post', function(req, res) {
  if (req.body.type === 'text') {
    twilio.sendSms(req.body.data, "Thanks for stopping by!", req.body.link);
    setTimeout(function() {
      res.send(twilio.status);
    }, 1000);
  }
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