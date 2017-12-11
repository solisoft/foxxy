$(function() {

  route('/', function(name) {
    // Here set the / mount
    riot.mount('div#app', 'loading')
  })

  route('/welcome', function(name) {riot.mount('div#app', 'welcome') })

  route('/login', function(name) {riot.mount('div#app', 'login') })
  route('/signup', function(name) {riot.mount('div#app', 'signup') })

  route('/confirm/*', function(id) {
    common.post(url+'auth/confirm', JSON.stringify({ uuid: id }), function() {
      document.location.href = "index.html"
    })
  })

  route('/logout', function(name) {
    common.post(url +"auth/logout", "", function(d) {
      localStorage.removeItem('X-Session-Id')
      document.location.href = "login.html"
    })
  })

  /*@{{router}}*/

  route(function(collection, id, action) {
    if(action != undefined) {
      /*@{{router_cia}}*/
    }
  })

  route(function(collection, action) {
    /*@{{router_ca}}*/
  })

  route.start(true)
  //riot.mount("*")
})