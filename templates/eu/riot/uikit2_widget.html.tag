<@{{objects}}>
  <h3>@{{objects}}</h3>

  <form onsubmit="{ save_form }" class="uk-form" id="form_@{{objects}}">
  </form>

  <script>
    save_form(e) {
      e.preventDefault()
      common.saveForm("form_@{{objects}}", "@{{objects}}", _this.obj._key)
    }

    var _this = this;

    common.get(url + "@{{objects}}/", function(d) {
      _this.obj = d.data
      common.buildForm(_this.obj, d.fields, '#form_@{{objects}}')
    })

    this.on('updated', function() {
      $(".select_list").select2()
      $(".select_tag").select2({ tags: true })
    })
  </script>
</@{{objects}}>

