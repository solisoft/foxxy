'use strict';
const db = require('@arangodb').db;
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
module.context.use(router);

router.get('/', function (req, res) {
  res.send({ success: true });
})
.description('My first route');