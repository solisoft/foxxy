route('/@{{objects}}', function(name) {
    riot.mount('div#app', '@{{objects}}')
  })
  route('/@{{objects}}/*', function (folder_key) {
    riot.mount('div#app', '@{{objects}}', { folder_key: folder_key })
  })
  /*@{{router}}*/