const db = require('@arangodb').db
const joi = require('joi')

// Sample to load an external collection as list
// var users = db._query(`
//   FOR doc in users RETURN [doc._key, doc.username]
// `).toArray()

// Tags definition sample
// var tags = db._query(`
//   LET tags = (
//     FOR doc IN posts
//       FILTER doc.tags != NULL
//       RETURN doc.tags
//   )
//   RETURN UNIQUE(FLATTEN(tags))
// `).toArray()

// { r: new_row, c: "classname", n: "name/id", t: "type", j: joi.validation(), l: "Label", d: [["data", "list"]] },

// { r: true, c: "1-1", n: "title", t: "string", j: joi.string().required(), l: "Title" },
// { r: true, c: "1-1", n: "position", t: "integer", j: joi.number().integer(), l: "Position" },
// { r: true, c: "1-1", n: "published_at", t: "date", j: joi.date().format('DD-MM-YYYY').raw().required(), l: "Published_at" },
// { r: true, c: "1-1", n: "time", t: "time", j: joi.string(), l: "Time" },
// { r: true, c: "1-1", n: "desc", t: "text", j: joi.string(), l: "Description" },
// { r: true, c: "1-1", n: "user_key", t: "list", j: joi.string(), l: "User", d: users },
// { r: true, c: "1-1", n: "image", t: "image", j: joi.string(), l: "Pictures" },
// { r: true, c: "1-1", n: "file", t: "file", j: joi.string(), l: "Files" },
// { r: true, c: "1-1", n: "tags", t: "tags", j: joi.array(), l: "Tags", d: tags },

const load_fields = function() {

  return [
    // Define your model here ...
  ]

}

module.exports = load_fields