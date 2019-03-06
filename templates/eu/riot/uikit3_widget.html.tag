<@{{objects}}>
  <h3 if={can_access}>@{{objects}}</h3>

  <form onsubmit="{ save_form }" id="form_@{{objects}}">
  </form>
  <virtual if={!can_access && loaded}>
    Sorry, you can't access this page...
  </virtual>
  <script>
    var self = this;
    this.can_access = false
    this.loaded     = false

    save_form(e) {
      e.preventDefault()
      common.saveForm("form_settings", "settings", self.obj._key)
    }

    var self = this;

    common.get(url + "settings/", function(d) {
      self.obj = d.data
      common.get(url + "/auth/whoami", function(me) {
        self.update()
        self.loaded = true
        self.can_access = d.roles === undefined || _.includes(d.roles.write, me.role)
        if(self.can_access) common.buildForm(self.obj, d.fields, '#form_settings')
        self.update()
      })
    })

    this.on('updated', function() {
      $(".select_list").select2()
      $(".select_tag").select2({ tags: true })
    })
  </script>
</@{{objects}}>

