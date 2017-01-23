'use strict';
const db = require('@arangodb').db;
const settings = 'foxxy_settings';
const users = 'users';

if (!db._collection(settings)) {
  db._createDocumentCollection(settings);
  db._collection(settings).save({ 
    jwt_secret: "Set a secret password here for production purpose",
    mailgun_apikey: "mailgun_apikey",
    mailgun_domain: "mailgun_domain",
    mailgun_from: "mailgun_from"
  });
}

if (!db._collection(users)) {
  db._createDocumentCollection(users);
}

db._collection(users).ensureIndex({
  type: 'hash',
  fields: ['username'],
  unique: true
});