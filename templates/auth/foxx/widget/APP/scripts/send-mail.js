'use strict';
const db = require('@arangodb').db;
const _settings = db._collection('_settings').firstExample();
const request = require('@arangodb/request');
const params = module.context.argv[0];
console.log(`Sent to ${module.context.argv[0].to}`);

request({
  method: "POST",
  url: "https://api:"+ _settings.mailgun_apikey +"@api.mailgun.net/v3/"+ module.context.configuration.mailgun_domain +"/messages",
  form: {
    from: _settings.mailgun_from,
    to: params.to,
    subject: "Email confirmation",
    text: `Hi,

To confirm your email address, please clik on the link below :
https://${_settings.domain}/#confirm/${params.uuid}

If you don't know about this email, please ignore it

Best,
Foxxy app`
  }
})

