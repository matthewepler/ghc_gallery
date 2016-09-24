var config = require('./twilioConfig');
var client = require('twilio')(config.twilioAccountSid, config.twilioAuthToken);

module.exports.sendSms = function(to, message) {
  client.messages.create({
    body: message,
    to: to,
    from: config.twilioSendingNumber
    // mediaUrl: 'http://www.yourserver.com/someimage.png'
  }, function(err, data) {
    if (err) {
      console.error('Could not notify administrator');
      console.error(err);
    } else {
      console.log('Administrator notified');
    }
  });
};