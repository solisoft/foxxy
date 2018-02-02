'use strict';
const db = require('@arangodb').db;
const joi = require('joi');
const models = require('./models.js')();
const _ = require('lodash');
const createRouter = require('@arangodb/foxx/router');
const sessionsMiddleware = require('@arangodb/foxx/sessions');
const jwtStorage = require('@arangodb/foxx/sessions/storages/jwt');
require("@arangodb/aql/cache").properties({ mode: "on" });

const router = createRouter();
const _settings = db.foxxy_settings.firstExample();

const sessions = sessionsMiddleware({
  storage: jwtStorage(_settings.jwt_secret),
  transport: 'header'
});
module.context.use(sessions);
module.context.use(router);

var fieldsToData = function(fields, body, headers) {
  var data = {}
  _.each(fields, function(f) {
    if(f.tr != true) {
      if(_.isArray(body[f.n])) {
        data[f.n] = _.map(body[f.n], function(v) { return unescape(v) })
      } else {
        data[f.n] = unescape(body[f.n])
      }
    } else {
      data[f.n] = {}
      if(_.isArray(body[f.n])) {
        data[f.n][headers['foxx-locale']] = _.map(
          body[f.n], function(v) { return unescape(v) }
        )
      } else {
        data[f.n][headers['foxx-locale']] = unescape(body[f.n])
      }
    }
  })
  return data
}

// Comment this block if you want to avoid authorization
module.context.use(function (req, res, next) {
  if(!req.session.uid) res.throw('unauthorized')
  res.setHeader("Access-Control-Expose-Headers", "X-Session-Id")
  next();
});

// -----------------------------------------------------------------------------
router.get('/:service/page/:page', function (req, res) {
  res.send({ data: db._query(`
    LET count = LENGTH(@@collection)
    LET data = (FOR doc IN @@collection SORT doc._key DESC LIMIT @offset,25 RETURN doc)
    RETURN { count: count, data: data }
    `, { "@collection": req.pathParams.service,
         "offset": (req.pathParams.page - 1) * 25}).toArray() });
})
.header('X-Session-Id')
.description('Returns all objects');
// -----------------------------------------------------------------------------
router.get('/:service/search/:term', function (req, res) {
  res.send({ data: db._query(`
    FOR u IN FULLTEXT(@@collection, 'search', @term)
    LIMIT 100
    RETURN u`, { "@collection": req.pathParams.service,
                 "term": req.pathParams.term}).toArray() });
})
.header('foxx-locale')
.header('X-Session-Id')
.description('Returns all objects');
// -----------------------------------------------------------------------------
router.get('/:service/:id', function (req, res) {
  const collection = db._collection(req.pathParams.service)
  res.send({ fields: models[req.pathParams.service],
             data: collection.document(req.pathParams.id) });
})
.header('X-Session-Id')
.description('Returns object within ID');
// -----------------------------------------------------------------------------
router.get('/:service/fields', function (req, res) {
  res.send({ fields: models[req.pathParams.service] });
})
.header('X-Session-Id')
.description('Get all fields to build form');
// -----------------------------------------------------------------------------
router.post('/:service', function (req, res) {
  const collection = db._collection(req.pathParams.service)
  let fields = models[req.pathParams.service]
  const body = JSON.parse(req.body.toString())
  var obj = null
  var errors = []
  if(!_.isArray(fields)) fields = fields.model
  try {
    var schema = {}
    _.each(fields, function(f) {schema[f.n] = f.j })
    errors = joi.validate(body, schema, { abortEarly: false }).error.details
  }
  catch(e) {}
  if(errors.length == 0) {
    var data = fieldsToData(fields, body, req.headers)
    obj = collection.save(data, { waitForSync: true })
  }
  res.send({ success: errors.length == 0, data: obj, errors: errors });
}).header('foxx-locale')
.header('X-Session-Id')
.description('Create a new object.');
// -----------------------------------------------------------------------------
router.post('/:service/:id', function (req, res) {
  const collection = db._collection(req.pathParams.service)
  let fields = models[req.pathParams.service]
  const body = JSON.parse(req.body.toString())
  var obj = null
  var errors = []
  if(!_.isArray(fields)) fields = fields.model
  try {
    var schema = {}
    _.each(fields, function(f) {schema[f.n] = f.j })
    errors = joi.validate(body, schema, { abortEarly: false }).error.details
  }
  catch(e) {}
  if(errors.length == 0) {
    var object = collection.document(req.pathParams.id)
    var data = fieldsToData(fields, body, req.headers)
    // data.search = update with what you want to search for
    obj = collection.update(object, data)
  }
  res.send({ success: errors.length == 0, data: obj, errors: errors });
})
.header('foxx-locale')
.header('X-Session-Id')
.description('Update a object.');
// -----------------------------------------------------------------------------
router.delete('/:service/:id', function (req, res) {
  const collection = db._collection(req.pathParams.service)
  collection.remove(req.pathParams.service+"/"+req.pathParams.id)
  res.send({success: true });
})
.header('X-Session-Id')
.description('delete a object.');

// Sub
// -----------------------------------------------------------------------------
router.get('/sub/:id/:service/:key/page/:page', function (req, res) {
  res.send({ data: db._query(`
    LET count = LENGTH(@@collection)
    LET data = (FOR doc IN @@collection FILTER doc.@key == @id SORT doc._key DESC LIMIT @offset,25 RETURN doc)
    RETURN { count: count, data: data }
    `, { "@collection": req.pathParams.service,
         "offset": (req.pathParams.page - 1) * 25,
         "key": req.pathParams.key,
         "id": req.pathParams.id }).toArray() });
})
.header('X-Session-Id')
.description('Returns all sub objects');
// -----------------------------------------------------------------------------
router.post('/sub/:service/:subservice', function (req, res) {
  const collection = db._collection(req.pathParams.subservice)
  const fields = models[req.pathParams.service].sub_models[req.pathParams.subservice].fields
  const body = JSON.parse(req.body.toString())
  var obj = null
  var errors = []
  try {
    var schema = {}
    _.each(fields, function(f) {schema[f.n] = f.j })
    errors = joi.validate(body, schema, { abortEarly: false }).error.details
  }
  catch(e) {}
  if(errors.length == 0) {
    var data = fieldsToData(fields, body, req.headers)
    obj = collection.save(data, { waitForSync: true })
  }
  res.send({ success: errors.length == 0, data: obj, errors: errors });
}).header('foxx-locale')
.header('X-Session-Id')
.description('Create a new sub object.');
// -----------------------------------------------------------------------------
router.post('/sub/:service/:subservice/:id', function (req, res) {
  const collection = db._collection(req.pathParams.subservice)
  const fields = models[req.pathParams.service].sub_models[req.pathParams.subservice].fields
  const body = JSON.parse(req.body.toString())
  var obj = null
  var errors = []
  try {
    var schema = {}
    _.each(fields, function(f) {schema[f.n] = f.j })
    errors = joi.validate(body, schema, { abortEarly: false }).error.details
  }
  catch(e) {}
  if(errors.length == 0) {
    var object = collection.document(req.pathParams.id)
    var data = fieldsToData(fields, body, req.headers)
    // data.search = update with what you want to search for
    obj = collection.update(object, data)
  }
  res.send({ success: errors.length == 0, data: obj, errors: errors });
})
.header('foxx-locale')
.header('X-Session-Id')
.description('Update a sub object.');