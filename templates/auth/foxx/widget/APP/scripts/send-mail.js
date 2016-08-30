'use strict';
const request = require('@arangodb/request');
const params = module.context.argv[0];
console.log(`Sent to ${module.context.argv[0].to}`);

request({
  method: "POST",
  url: "https://api:"+ module.context.configuration.mailgun_apikey +"@api.mailgun.net/v3/"+ module.context.configuration.mailgun_domain +"/messages",
  form: {
    from: module.context.configuration.mailgun_from,
    to: params.to,
    subject: "Email confirmation",
    text: `Hi,

To confirm your email address, please clik on the link below :
https://board.plugandwork.net/login#confirm/${params.uuid}

If you don't know about this email, please ignore it

Best,
Foxxy app`
  }
})

