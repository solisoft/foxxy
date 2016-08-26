if(collection == "@{{objects}}") {
        if(action == "edit") {
          riot.mount('div#app', '@{{object}}_edit', { @{{object}}_id: id })  
        }
      } 
      /*@{{router_cia}}*/