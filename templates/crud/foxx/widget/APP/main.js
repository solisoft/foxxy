'use strict';
const collName = "@{{objects}}"
const db = require('@arangodb').db;
const joi = require('joi');
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

var fields = []
var schema = {}

// Comment this block if you want to avoid authorization
module.context.use(function (req, res, next) {
  if(!req.session.uid) res.throw('unauthorized')
  res.setHeader("Access-Control-Expose-Headers", "X-Session-Id")
  next();
});

var loadFields = function(req) {
  // Sample to load an external collection as list
  // var data = []
  // try {
  //   data = db._query(`FOR doc in @@collection
  //   FILTER doc.foreign_key == @key
  //   RETURN [doc._key, doc.desired_field_name]
  //   `, { "@collection": "whatever", key: req.session.data.key })._documents
  // } catch(e) {}
  // { r: new_row, c: "classname", n: "name/id", t: "type", j: joi.validation(), l: "Label", d: data },

  // Tags definition sample
  // var tags = db._query(`
  //   LET tags = (
  //     FOR doc IN posts
  //       RETURN doc.tags
  //   )
  //   RETURN UNIQUE(FLATTEN(tags))
  // `).toArray()


  // { r: new_row, c: "classname", n: "name/id", t: "type", j: joi.validation(), l: "Label", d: [["data", "list"]] },

  // { r: true, c: "1-1", n: "field1", t: "string", j: joi.string().required(), l: "Field1" },
  // { r: true, c: "1-1", n: "field2", t: "integer", j: joi.number().integer(), l: "Field2" },
  // { r: true, c: "1-1", n: "field3", t: "date", j: joi.date().format('DD-MM-YYYY').raw().required(), l: "Field3" },
  // { r: true, c: "1-1", n: "field4", t: "time", j: joi.string(), l: "Field4" },
  // { r: true, c: "1-1", n: "field5", t: "text", j: joi.string(), l: "Field5" },
  // { r: true, c: "1-1", n: "field6", t: "list", j: joi.string(), l: "Field6", d: data },
  // { r: true, c: "1-1", n: "field7", t: "image", j: joi.string(), l: "Field7" },
  // { r: true, c: "1-1", n: "field8", t: "file", j: joi.string(), l: "Field8" },
  // { r: true, c: "1-1", n: "field9", t: "tags", j: joi.array(), l: "Field5", d: tags },

  fields = [
  ]

  schema = {}
  each(fields, function(f) {
    schema[f.n] = f.j
  })
}
loadFields({});

router.get('/page/:page', function (req, res) {
  res.send({ data: db._query(`
    LET count = LENGTH(@@collection)
    LET data = (FOR doc IN @@collection SORT doc._key DESC LIMIT @offset,25 RETURN doc)
    RETURN { count: count, data: data }
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
  loadFields(req);
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
  loadFields(req);
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