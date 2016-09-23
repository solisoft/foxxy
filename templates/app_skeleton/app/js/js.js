$(function() {

  riot.route('/', function(name) {
    // Here set the / mount
    riot.mount('div#app', 'loading')
  })

  riot.route('/login', function(name) {riot.mount('div#app', 'login') })
  riot.route('/signup', function(name) {riot.mount('div#app', 'signup') })

  riot.route('/confirm/*', function(id) {
    $.post(url+'auth/confirm', JSON.stringify({ uuid: id }), function() {
      document.location.href = "index.html"
    })
  })
  
  riot.route('/logout', function(name) {
    $.post(url +"auth/logout", function(d) {
      document.location.href = "login.html"
    })
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
  //riot.mount("*")
})