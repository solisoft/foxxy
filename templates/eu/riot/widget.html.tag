<@{{objects}}>
  <h3>@{{objects}}</h3>
  
  <form onsubmit="{ save_form }" class="uk-form" id="form_@{{objects}}">
  </form>

  <script>    
    save_form(e) {
      common.checkLogin()
      common.saveForm("form_@{{object}}", "@{{object}}", _this.obj._key)
    }

    var _this = this;    
    
    common.checkLogin()

    $.get(url + "@{{objects}}/", function(d) {
      _this.obj = d.data      
      common.buildForm(_this.obj, d.fields, '#form_@{{object}}')
    })
  </script>
</@{{objects}}>

