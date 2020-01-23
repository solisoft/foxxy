if(collection == "@{{objects}}") {
        if(action == "edit") {
          riot.mount('div#app', '@{{object}}_edit', { @{{object}}_id: id })
        }
        if(action == "new") { riot.mount('div#app', '@{{object}}_new', { folder_key: id }) }
      }
      /*@{{router_cia}}*/