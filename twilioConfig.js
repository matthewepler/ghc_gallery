var cfg = {}

cfg.secret = process.env.APP_SECRET

// A good practice is to store these string values as system environment
// variables, and load them from there as we are doing below. Alternately,
// you could hard code these values here as strings.
cfg.twilioAccuntSid = process.env.TWILIO_ACCOUNT_SID;
cfg.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
cfg.twilioSendingNumber = process.env.TWILIO_NUMBER;

var requiredConfig = [cfg.twilioAccuntSid, cfg.twilioAuthToken, cfg.twilioSendingNumber];
var isConfigured = requiredConfig.every(function(configValue) {
  return configValue || false;
});

if (!isConfigured) {
  var errorMessage =
    'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.';

  throw new Error(errorMessage);
}

module.exports = cfg;