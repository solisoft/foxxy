<loading>
  <div class="uk-text-center">
    Loading app ...
    <i class="uk-icon-spinner uk-icon-spin"></i>
  </div>

  <script>
    riot.route('/login');
  </script>
</loading>

<login>

  <div class="uk-container uk-container-center">
    <div class="uk-grid">
      <div class="uk-width-medium-2-10 uk-width-small-1-10"></div>
      <div class="content uk-width-medium-6-10 uk-width-small-8-10">
        <h1 class="uk-margin-large-top"><i class="uk-icon-sign-in"></i> Connection</h1>
        <form class="uk-form uk-margin-top"  onsubmit="{ save_form }">


           <div class="uk-form-row">
             <input type="email" placeholder="Email" class="uk-width-1-1" id="username" name="username" value="">

           </div>
           
           <div class="uk-form-row">
             <input type="password" placeholder="Mot de passe" class="uk-width-1-1" id="password" name="password" value="">
           </div>
           <div class="uk-form-row">
             <div class="uk-text-right">
               <a href="#" class="uk-text-contrast">Forgot password?</a>
             </div>
           </div>
           <hr>
           <div class="uk-form-row">
             <button type="submit" class="uk-button uk-button-primary">Connection</button>
             <a href="#signup" class="uk-button">Don't have an account? Signup !</a>
             <div id="login_error" class="uk-alert uk-alert-danger uk-hidden uk-text-center">
               Bad login or password
             </div>
           </div>
           
        </form>

      </div>
      <div class="uk-width-medium-2-10 uk-width-small-1-10"></div>
    </div>
  </div>
  
  <script>
    save_form(e) {
      $.post(url + "auth/login", JSON.stringify({ "username": $("#username").val(), "password": $("#password").val() }) , function(data) {
        if(data.success) document.location.href="index.html";
        else {
          $("#login_error").removeClass("uk-hidden")
        }
      })
    }
  </script>

</login>

<signup>
  <div class="uk-container uk-container-center">
    <div class="uk-grid">
      <div class="uk-width-medium-2-10 uk-width-small-1-10"></div>
      <div class="content uk-width-medium-6-10 uk-width-small-8-10">
        <h1 class="uk-margin-large-top"><i class="uk-icon-sign-in"></i> Creating an account</h1>
        <form class="uk-form uk-margin-top" id="form_signup"  onsubmit="{ save_form }">
            <div class="uk-form-row">
              <input type="text" placeholder="Company" class="uk-width-1-1" id="company" name="company" value="" required='true'>
              <div data-hint="company" class="uk-text-danger"></div>
            </div>
            
            <div class="uk-form-row">
              <input type="text" placeholder="Last Name" class="uk-width-1-1" id="ln" name="ln" value="" required='true'>
              <div data-hint="ln" class="uk-text-danger"></div>
            </div>

            
            <div class="uk-form-row">
              <input type="text" placeholder="First Name" class="uk-width-1-1" id="fn" name="fn" value="" required='true'>
              <div data-hint="fn" class="uk-text-danger"></div>
            </div>
           
            
            <div class="uk-form-row">
              <input type="text" placeholder="Email" class="uk-width-1-1" id="username" name="username" value="" required='true'>
              <div data-hint="username" class="uk-text-danger"></div>
            </div>
            
            <div class="uk-form-row">
              <input type="password" placeholder="Password" class="uk-width-1-1" id="password" name="password" value="" required='true'>
              <div data-hint="password" class="uk-text-danger"></div>
            </div>
            
            <div class="uk-form-row">
              <input type="password" placeholder="Password Confirmation" class="uk-width-1-1" id="password_confirmation" name="password_confirmation" value="" required='true'>
              <div data-hint="password_confirmation" class="uk-text-danger"></div>
            </div>
            <hr>
            <div class="uk-form-row">
            <button type="submit" class="uk-button uk-button-primary">Create account</button>
            <a href="#login" class="uk-button">Already have an account? Signin!</a>
            </div>

        </form>
        
      </div>
      <div class="uk-width-medium-2-10 uk-width-small-1-10"></div>
    </div>
  </div>
  
  <script>
    var _this = this;
    this.fields = [] 
    $.get(url + "auth/fields", function(d) {
      _this.fields = d.fields;
    })

    save_form(e) {
      common.checkForm("form_signup", "auth", function(err) {
        var json = JSON.stringify($("#form_signup").serializeObject())
        if(err === null)
          $.post(url + "auth/signup", json, function(data) {
            if(data.success) document.location.href = "index.html"
          })
      })
      
    }
  </script>

</signup>