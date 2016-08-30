'use strict';
const db = require('@arangodb').db;
//const joi = require('joi');
//const each = require('underscore').each;
const createRouter = require('@arangodb/foxx/router');
const sessionsMiddleware = require('@arangodb/foxx/sessions');

const router = createRouter();
//const collection = db._collection(collName);

const sessions = sessionsMiddleware({
  storage: 'sessions',
  transport: 'cookie'
});
module.context.use(sessions);
module.context.use(router);

router.get('/', function (req, res) {
  res.send({ success: true });
})
.description('My first route');

