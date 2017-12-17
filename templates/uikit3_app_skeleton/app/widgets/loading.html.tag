<loading>
  <div class="uk-text-center">
    Loading app ...
    <br><div uk-spinner></div>
  </div>

  <script>
    common.get(url + "auth/whoami", function(d) {
      if(d.username === null) document.location.href="login.html";
      else {
        // Load the widget you want
        route('/welcome')
      }
    })
  </script>
</loading>

<welcome>

  <h1>Welcome aboard</h1>
  <p>This is a landing page ... Nothing special here, replace it by what you want !</p>

  <p>Find me in <code>app/widgets/loading.html.tag</code></p>

</welcome>