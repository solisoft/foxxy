$(function() {

  riot.route('/', function(name) {
    // Here set the / mount
    // riot.mount('div#app', 'loading')
  })

  /*@{{router}}*/
  
  riot.route(function(collection, id, action) {
    if(action != undefined) {
      /*@{{router_cia}}*/
    }
  })

  riot.route(function(collection, action) {
    /*@{{router_ca}}*/    
  })
  
  riot.route.start(true)
  riot.mount("*")
})