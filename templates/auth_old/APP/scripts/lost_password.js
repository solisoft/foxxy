'use strict';
const request = require('@arangodb/request');
const params = module.context.argv[0];

request({
  method: "POST",
  url: "https://api:"+ module.context.configuration.mailgun_apikey +"@api.mailgun.net/v3/"+ module.context.configuration.mailgun_domain +"/messages",
  form: {
    from: module.context.configuration.mailgun_from,
    to: params.to,
    subject: "Lost password",
    text: `Bonjour,

You asked to change your password. Please follow instruction on link below :
http://enter.your.urk/login#change_password/${params.uuid}

Best,
Foxxy App`
  }
})

