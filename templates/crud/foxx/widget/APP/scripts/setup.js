'use strict';
const db = require('@arangodb').db;

const collection = '@{{objects}}';

if (!db._collection(collection)) {
  db._createDocumentCollection(collection);
}

db._collection("@{{objects}}").ensureIndex({
  type: 'fulltext',
  fields: ['search']
});