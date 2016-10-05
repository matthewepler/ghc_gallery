var nodemailer = require('nodemailer');

module.exports.status = null;

module.exports.sendEmail = function(userAddress, imgLink) {
  var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'emojifiedghc@gmail.com',
          pass: '599broadway'
        }
    });

    var regex = /\d{13}/
    var cid = imgLink.match(regex)[0];

    var mailOptions = {
      from: 'emojifiedghc@gmail.com',
      to: userAddress,
      subject: ' Check out your emoji from #ghc16!',
      html: '<p>Thanks for dropping by the Google booth and coding your one-of-a-kind emoji. Your emoji is attached below.</p><br/><img src="cid:' + cid + '"/>',
      attachments: [{
        filename: cid + '.png',
        path: imgLink,
        cid: cid
      }]
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log('email error: ', error);
        module.exports.status = false;
      } else {
        console.log('email sent: ', cid);
        module.exports.status = true;
      }
    });
}