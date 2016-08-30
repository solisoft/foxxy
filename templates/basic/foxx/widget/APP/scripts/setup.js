'use strict';
const db = require('@arangodb').db;

// Always look for sessions collection
if (!db._collection("sessions")) {
  db._createDocumentCollection("sessions");
}