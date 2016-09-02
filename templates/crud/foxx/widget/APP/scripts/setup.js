'use strict';
const db = require('@arangodb').db;

const collection = '@{{objects}}';

if (!db._collection(collection)) {
  db._createDocumentCollection(collection);
}

// Always look for sessions collection
if (!db._collection("sessions")) {
  db._createDocumentCollection("sessions");
}

db._collection("@{{objects}}").ensureIndex({
  type: 'fulltext',
  fields: ['search']
});