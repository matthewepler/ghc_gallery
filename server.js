var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var morgan = require('morgan');
var csurf = require('csurf');
var emailer = require('./emailConfig.js');

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
  response.sendFile(__dirname + '/dist/index.html') // change to 'login.html' if activating login
})

app.get('/admin', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html');
})

// - THIS SECTION ADDS A LOGIN PAGE TO LIMIT ACCESS -

// app.get('/app', function(request, response) {
//   response.redirect('/');
// });

// app.post('/app', function(request, response) {
//   console.log(request.body.user, request.body.password);
//   if (request.body.user.trim() === process.env.USER && request.body.password.trim() === process.env.PSWD) {
//     response.sendFile(__dirname + '/dist/login.html');
//   } else {
//     response.redirect('/');
//   }
// });

app.post('/', function(req, res) { // prepend '/app' to route if activating login
  console.log(req.body.type, req.body.data);
  if (req.body.type === 'text') {
    twilio.sendSms(req.body.data, req.body.link);
    setTimeout(function() {
      res.send(twilio.status);
    }, 3000);
  } else if (req.body.type === 'email') {
    emailer.sendEmail(req.body.data, req.body.link);
    setTimeout(function() {
      res.send(emailer.status);
    }, 5000)
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