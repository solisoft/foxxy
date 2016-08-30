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
loadFields()

router.get('/', function (req, res) {
  if(!req.session.uid) res.throw('unauthorized')
  loadFields();
  res.send({ fields: fields, data: db._query("FOR doc IN @@collection RETURN doc", { "@collection": collName})._documents[0] });
})
.description('Returns first @{{object}}');

router.get('/check_form', function (req, res) {
  if(!req.session.uid) res.throw('unauthorized')
    var errors = []
  try {
    errors = joi.validate(JSON.parse(req.queryParams.data), schema, { abortEarly: false }).error.details
  } catch(e) {}
  res.send({errors: errors });
})
.description('Check the form for live validation');

router.post('/:id', function (req, res) {
  if(!req.session.uid) res.throw('unauthorized')
  var obj = collection.document(req.pathParams.id)
  var data = {}
  each(fields, function(f) {data[f.n] = req.body[f.n]})
  collection.update(obj, data)
  res.send({ success: true });
})
.body(joi.object(schema), 'data')
.description('Update @{{object}}.');
