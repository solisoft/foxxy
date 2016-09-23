<loading>
  <div class="uk-text-center">
    Loading app ...
    <i class="uk-icon-spinner uk-icon-spin"></i>
  </div>

  <script>
    $.get(url + "auth/whoami", function(d) {
      if(d.username === null) document.location.href="login.html"; 
      else {
        // Load the widget you want
        // riot.route('/my-app')
      }
    })
  </script>
</loading>