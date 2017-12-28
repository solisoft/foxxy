'use strict';
const db = require('@arangodb').db;
const joi = require('joi');
const fields = require('./model.js');
const config = require('./config.js');
const _ = require('lodash');
const createRouter = require('@arangodb/foxx/router');
const sessionsMiddleware = require('@arangodb/foxx/sessions');
const jwtStorage = require('@arangodb/foxx/sessions/storages/jwt');
require("@arangodb/aql/cache").properties({ mode: "on" });

const router = createRouter();
const collection = db._collections(config.collection);

const _settings = db.foxxy_settings.firstExample();

const sessions = sessionsMiddleware({
  storage: jwtStorage(_settings.jwt_secret),
  transport: 'header'
});
module.context.use(sessions);
module.context.use(router);

var fieldsToData = function(fields, req) {
  var data = {}
  _.each(fields(), function(f) {
    if(f.tr != true) {
      if(_.isArray(req.body[f.n])) {
        data[f.n] = _.map(req.body[f.n], function(v) { return unescape(v) })
      } else {
        data[f.n] = unescape(req.body[f.n])
      }
    } else {
      data[f.n] = {}
      if(_.isArray(req.body[f.n])) {
        data[f.n][req.headers['foxx-locale']] = _.map(
          req.body[f.n], function(v) { return unescape(v) }
        )
      } else {
        data[f.n][req.headers['foxx-locale']] = unescape(req.body[f.n])
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

var schema = {}
_.each(fields(), function(f) {schema[f.n] = f.j })

// -----------------------------------------------------------------------------
router.get('/page/:page', function (req, res) {
  res.send({ data: db._query(`
    LET count = LENGTH(${config.collection})
    LET data = (FOR doc IN ${config.collection} SORT doc._key DESC LIMIT @offset,25 RETURN doc)
    RETURN { count: count, data: data }
    `, { "offset": (req.pathParams.page - 1) * 25}).toArray() });
})
.header('X-Session-Id')
.description('Returns all objects');
// -----------------------------------------------------------------------------
router.get('/search/:term', function (req, res) {
  res.send({ data: db._query(`
    FOR u IN FULLTEXT(${config.collection}, 'search', @term)
    LIMIT 100
    RETURN u`, { "term": req.pathParams.term}).toArray() });
})
.header('foxx-locale')
.header('X-Session-Id')
.description('Returns all objects');
// -----------------------------------------------------------------------------
router.get('/:id', function (req, res) {
  res.send({fields: fields(), data: collection.document(req.pathParams.id) });
})
.header('X-Session-Id')
.description('Returns object within ID');
// -----------------------------------------------------------------------------
router.get('/check_form', function (req, res) {
  var errors = []
  try {
    errors = joi.validate(JSON.parse(unescape(req.queryParams.data)), schema, { abortEarly: false }).error.details
  }
  catch(e) {}
  res.send({errors: errors });
})
.header('X-Session-Id')
.description('Check the form for live validation');
// -----------------------------------------------------------------------------
router.get('/fields', function (req, res) {
  res.send({ fields: fields() });
})
.header('X-Session-Id')
.description('Get all fields to build form');
// -----------------------------------------------------------------------------
router.post('/', function (req, res) {
  var data = fieldsToData(fields, req)
  // data.search = update with what you want to search for
  res.send({ success: true, key: collection.save(data, { waitForSync: true }) });
})
.body(joi.object(schema), 'data')
.header('foxx-locale')
.header('X-Session-Id')
.description('Create a new object.');
// -----------------------------------------------------------------------------
router.post('/:id', function (req, res) {
  var object = collection.document(req.pathParams.id)
  var data = fieldsToData(fields, req)
  // data.search = update with what you want to search for
  collection.update(object, data)
  res.send({ success: true });
})
.body(joi.object(schema), 'data')
.header('foxx-locale')
.header('X-Session-Id')
.description('Update an object.');
// -----------------------------------------------------------------------------
router.delete('/:id', function (req, res) {
  collection.remove(config.collection+"/"+req.pathParams.id)
  res.send({success: true });
})
.header('X-Session-Id')
.description('delete an object.');