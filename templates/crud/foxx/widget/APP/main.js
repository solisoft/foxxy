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

var loadFields = function() {
  // r: new row; c: classname; n: name/id; t: type; j: joi validation; l: label; d: data list
  fields = [
  ]
    
  schema = {}
  each(fields, function(f) {
    schema[f.n] = f.j
  })
}


router.get('/', function (req, res) {
  if(!req.session.uid) res.throw('unauthorized')
  res.send({ data: db._query("FOR doc IN @@collection RETURN doc", { "@collection": collName})._documents });
})
.description('Returns all objects');

router.get('/:id', function (req, res) {
  if(!req.session.uid) res.throw('unauthorized')
  loadFields();
  res.send({fields: fields, data: collection.document(req.pathParams.id) });
})
.description('Returns object within ID');

router.get('/check_form', function (req, res) {
  if(!req.session.uid) res.throw('unauthorized')
    var errors = []
  try {
    errors = joi.validate(JSON.parse(req.queryParams.data), schema, { abortEarly: false }).error.details
  } catch(e) {}
  res.send({errors: errors });
})
.description('Check the form for live validation');

router.get('/fields', function (req, res) {
  if(!req.session.uid) res.throw('unauthorized')
  loadFields();
  res.send({ fields: fields });
})
.description('Get all fields to build form');

router.post('/', function (req, res) {
  if(!req.session.uid) res.throw('unauthorized')
  var data = {}
  each(fields, function(f) {data[f.n] = req.body[f.n]})
  var data = collection.save(data, { waitForSync: true })
  res.send({ success: true, key: data });  
})
.body(joi.object(schema), 'data')
.description('Create a new object.');

router.post('/:id', function (req, res) {
  if(!req.session.uid) res.throw('unauthorized')
  var object = collection.document(req.pathParams.id)
  var data = {}
  each(fields, function(f) {data[f.n] = req.body[f.n]})
  collection.update(object, data)
  res.send({ success: true });
})
.body(joi.object(schema), 'data')
.description('Update a object.');

router.delete('/:id', function (req, res) {
  if(!req.session.uid) res.throw('unauthorized')
  collection.remove(collName + "/"+req.pathParams.id)
  res.send({success: true });
})
.description('delete a object.');