var config = require('./twilioConfig');
var client = require('twilio')(config.twilioAccountSid, config.twilioAuthToken);

module.exports.sendSms = function(to, message, url) {
  client.messages.create({
    body: message,
    to: to,
    from: config.twilioSendingNumber,
    mediaUrl: url
  }, function(err, data) {
    if (err) {
      console.error('TWILIO ERROR: Could not send text to', to);
      console.error(err);
    } else {
      console.log('TWILIO SUCCESS: SMS sent to', to);
    }
  });
};