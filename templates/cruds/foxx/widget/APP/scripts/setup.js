'use strict';
const db = require('@arangodb').db;

function create_collection(collection) {
  if (!db._collection(collection)) {db._createDocumentCollection(collection); }
  db._collection(collection).ensureIndex({
    type: 'fulltext',
    fields: ['search.en']
  });

  db._collection(collection).ensureIndex({
    type: 'skiplist',
    fields: ['order']
  });
}


var create_edge_collection = function (collection) {
  if (!db._collection(collection)) { db._createEdgeCollection(collection); }
}

var create_graph = function (graphName, edge, from, to) {
  if (!Graph._exists(graphName)) {
    Graph._create(graphName,
      [Graph._relation(edge, from, to)]
    );
  }
}

create_edge_collection('folder_path')
create_graph('folderGraph', 'folder_path', 'folders', 'folders')
create_collection('revisions');

/*@{{setup}}*/