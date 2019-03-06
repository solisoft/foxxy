'use strict';
const db = require('@arangodb').db;
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
module.context.use(router);
const _settings = db._collection('foxxy_settings').firstExample()

// -----------------------------------------------------------------------------
// GET /v1/assets/:filename
router.get('/assets/:filename', function (req, res) {
  const filename  = req.pathParams.filename.split('-').join('/')
  const upload    = _settings.upload_path + filename

  res.sendFile(upload)
})
  .description("Load a file by filename")