'use strict';
const collName = "@{{objects}}"
const db = require('@arangodb').db;
const joi = require('joi');
const each = require('underscore').each;
const createRouter = require('@arangodb/foxx/router');
const sessionsMiddleware = require('@arangodb/foxx/sessions');

const router = createRouter();
const collection = db._collection(collName);

const sessions = sessionsMiddleware({
  storage: 'sessions',
  transport: 'cookie'
});
module.context.use(sessions);
module.context.use(router);

var fields = []
var schema = {}

// Comment this block if you want to avoid authorization
module.context.use(function (req, res, next) {
  if(!req.session.uidd) res.throw('unauthorized')
  next();
});

var loadFields = function() {
  // { r: new_row, c: classname, n: name/id, t: type, j: joi validation, l: label, d: data list }
  fields = [
  ]
    
  schema = {}
  each(fields, function(f) {
    schema[f.n] = f.j
  })
}
loadFields();

router.get('/page/:page', function (req, res) {
  res.send({ data: db._query(`
    LET count = LENGTH(@@collection)
    LET datausers = (FOR doc IN @@collection SORT doc._key DESC LIMIT @offset,25 RETURN doc)
    RETURN { count: count, users: datausers }
    `, { "@collection": collName, "offset": (req.pathParams.page - 1) * 25})._documents });
  
})
.description('Returns all objects');

router.get('/search/:term', function (req, res) {
  res.send({ data: db._query(`
    FOR u IN FULLTEXT(@@collection, 'search', @term)
    LIMIT 100
    RETURN u`, { "@collection": collName, "term": req.pathParams.term})._documents });
})
.description('Returns all objects');

router.get('/:id', function (req, res) {
  loadFields();
  res.send({fields: fields, data: collection.document(req.pathParams.id) });
})
.description('Returns object within ID');

router.get('/check_form', function (req, res) {
    var errors = []
  try {
    errors = joi.validate(JSON.parse(req.queryParams.data), schema, { abortEarly: false }).error.details
  } catch(e) {}
  res.send({errors: errors });
})
.description('Check the form for live validation');

router.get('/fields', function (req, res) {
  loadFields();
  res.send({ fields: fields });
})
.description('Get all fields to build form');

router.post('/', function (req, res) {
  var data = {}
  each(fields, function(f) {data[f.n] = req.body[f.n]})
  // data.search = update with what you want to search for
  res.send({ success: true, key: collection.save(data, { waitForSync: true }) });  
})
.body(joi.object(schema), 'data')
.description('Create a new object.');

router.post('/:id', function (req, res) {
  var object = collection.document(req.pathParams.id)
  var data = {}
  each(fields, function(f) {data[f.n] = req.body[f.n]})
  // data.search = update with what you want to search for
  collection.update(object, data)
  res.send({ success: true });
})
.body(joi.object(schema), 'data')
.description('Update a object.');

router.delete('/:id', function (req, res) {
  collection.remove(collName + "/"+req.pathParams.id)
  res.send({success: true });
})
.description('delete a object.');