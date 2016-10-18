var config = require('./twilioConfig');
var client = require('twilio')(config.twilioAccountSid, config.twilioAuthToken);

module.exports.sendSms = function(to, url) {
  const result = client.messages.create({
    // messagingServiceSid: 'MG64902ac0a99eb6fde35d5f11facc6955',
    to: to,
    from: '+13462014546', //process.env.TWILIO_NUMBER
    body: "Check out your emoji from #ghc16!",
    mediaUrl: url,
  }, function(err, data) {
    if (err) {
      console.error('TWILIO ERROR: Could not send text to', to);
      console.log(err);
      module.exports.status = false;
    } else {
      console.log(result);
      console.log('TWILIO SUCCESS: SMS sent to', to);
      module.exports.status = true;
    }
  });
};

/*
client.messages.create
  - with messagingServiceSid 
    - from = 'Emojified' -> no error, but no message sent
    - from = '+13462014546' -> sends w/ number
    - no 'from' field -> sends w/ number

  - without messagingServiceSid
    - from = 'Emojified' -> Error (see below)
    - from = '+13462014546' -> sends w/ number
    - no 'from' field -> Error: "A From phone number is required"

client.sendMessage
  - with messagingServiceSid
    - from = 'Emojified' -> no error, but no message sent
    - from = '+13462014546 -> sends w/ number
    - no 'from' field -> sends w/ number

  - without messagingServiceId
    - from = 'Emojified' -> Error (see below)
    - from = '+13462014546 -> sends w/ number
    - no 'from' field -> Error: "A From phone number is required"


Error Message
{ 
  status: 400,
  message: 'The \'From\' number Emojified is not a valid phone number, shortcode, or alphanumeric sender ID.',
  code: 21212,
  moreInfo: 'https://www.twilio.com/docs/errors/21212' 
}

curl test

curl -XPOST https://api.twilio.com/2010-04-01/Accounts/ACa609eb984d46637e18da30890fd8113f/Messages -d "Body=Hi" -d "To=12134077416" -d "From=Emojified" -u "ACa609eb984d46637e18da30890fd8113f:7e45e53f052cbb29e80a8d5a87ae89b4"

response:
?xml version='1.0' encoding='UTF-8'?> 
<TwilioResponse><RestException><Code>21612</Code><Message>The 'To' phone number: +12134077416, is not currently reachable using the 'From' phone number: Emojified via SMS.</Message><MoreInfo>https://www.twilio.com/docs/errors/21612</MoreInfo><Status>400</Status></RestException></TwilioResponse>%
*/