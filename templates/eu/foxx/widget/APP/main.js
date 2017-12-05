'use strict';
const collName = "@{{objects}}"
const db = require('@arangodb').db;
const joi = require('joi');
const fields = require('./model.js');
const each = require('lodash').each;
const createRouter = require('@arangodb/foxx/router');
const sessionsMiddleware = require('@arangodb/foxx/sessions');
const jwtStorage = require('@arangodb/foxx/sessions/storages/jwt');
require("@arangodb/aql/cache").properties({ mode: "on" });

const router = createRouter();
const collection = db._collection(collName);

const _settings = db._collection('foxxy_settings').firstExample();

const sessions = sessionsMiddleware({
  storage: jwtStorage(_settings.jwt_secret),
  transport: 'header'
});
module.context.use(sessions);
module.context.use(router);

var schema = {}

// Comment this block if you want to avoid authorization
module.context.use(function (req, res, next) {
  if(!req.session.uid) res.throw('unauthorized')
  res.setHeader("Access-Control-Expose-Headers", "X-Session-Id")
  next();
});

each(fields, function(f) {
  schema[f.n] = f.j
})

// -----------------------------------------------------------------------------
router.get('/', function (req, res) {
  loadFields();
  res.send({ fields: fields, data: db._query("FOR doc IN @@collection RETURN doc", { "@collection": collName}).toArray()[0] });
})
.description('Returns first @{{object}}');
// -----------------------------------------------------------------------------
router.get('/check_form', function (req, res) {
    var errors = []
  try {
    errors = joi.validate(JSON.parse(req.queryParams.data), schema, { abortEarly: false }).error.details
  } catch(e) {}
  res.send({errors: errors });
})
.description('Check the form for live validation');
// -----------------------------------------------------------------------------
router.post('/:id', function (req, res) {
  var obj = collection.document(req.pathParams.id)
  var data = {}
  each(fields(), function(f) {data[f.n] = req.body[f.n]})
  collection.update(obj, data)
  res.send({ success: true });
})
.body(joi.object(schema), 'data')
.description('Update @{{object}}.');
