'use strict';
const db = require('@arangodb').db;

if (!db._collection('settings')) {
  db._createDocumentCollection('settings');
  db._collection('settings').save({}) // Create an empty element
}
