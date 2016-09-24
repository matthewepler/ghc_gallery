var twilioClient = require('../twilioClient');
var admins = require('../administrators.json');

function formatMessage(errorToReport) {
  return '[This is a test] ALERT! It appears the server is' +
    'having issues. Exception: ' + errorToReport +
    '. Check Heroku and Twilio dashboards ' +
    'for more details.';
};

exports.notifyOnError = function(appError, request, response, next) {
  admins.forEach(function(admin) {
    var messageToSend = formatMessage(appError.message);
    twilioClient.sendSms(admin.phoneNumber, messageToSend);
  });
  next(appError);
};