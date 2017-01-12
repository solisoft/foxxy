'use strict';
const db = require('@arangodb').db;

if (!db._collection('@{{objects}}')) {
  db._createDocumentCollection('@{{objects}}');
  db._collection('@{{objects}}').save({}) // Create an empty element
}
