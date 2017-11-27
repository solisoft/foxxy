'use strict';
const db = require('@arangodb').db;
const joi = require('joi');
const _ = require('lodash');
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
const querystring = require('querystring');
const crypt = require('@arangodb/crypto');
const fs = require("fs");
const sessionsMiddleware = require('@arangodb/foxx/sessions');
const jwtStorage = require('@arangodb/foxx/sessions/storages/jwt');


const _settings = db._collection('foxxy_settings').firstExample();

const sessions = sessionsMiddleware({
  storage: jwtStorage(_settings.jwt_secret),
  transport: 'header'
});
module.context.use(sessions);
module.context.use(router);

module.context.use(function (req, res, next) {
  if(!req.session.uid) res.throw('unauthorized')
  res.setHeader("Access-Control-Expose-Headers", "X-Session-Id")
  next();
});

// GET /uploads/:key/:type/:field
router.get('/:key/:type/:field', function(req, res) {
  res.send(
    db.uploads.byExample(
      {
        field: req.pathParams.field,
        object_id: req.pathParams.key + '/' + req.pathParams.type
      }
    ).toArray()
  )
})
.description("Get all files for a specific id and field")

// POST /uploads/:key/:type/:field
router.post('/:key/:type/:field', function(req, res) {
  let docs = []
  _.each(req.body, function(data) {
    const uuid = crypt.genRandomAlphaNumbers(40)
    let filename = querystring.parse(data.headers["Content-Disposition"]
                              .split(';')[2].trim().replace(/"/g, ''))
                              .filename
    const filedest = _settings.upload_path + uuid + "."+ _.last(filename.split('.'))
    const urldest = _settings.upload_url + uuid + "."+ _.last(filename.split('.'))
    fs.write(filedest, data.data)
    docs.push(
      db.uploads.save({
        path: filedest,
        url: urldest,
        filename: filename,
        object_id: req.pathParams.type + '/' + req.pathParams.key,
        length: data.data.length,
        mime: data.headers["Content-Type"],
        field: req.pathParams.field
      })
    )
  })
  res.send(docs)
})
.body(['multipart/form-data'])
.description("Upload a file")


// DELETE /uploads/:key
router.delete('/:key', function(req, res) {
  let upload = db.uploads.document(req.pathParams.key)
  // Remove file
  fs.remove(upload.path)
  // Delete document
  db.uploads.remove(req.pathParams.key)
  res.send({ success: true })
})
.description("Delete an upload")