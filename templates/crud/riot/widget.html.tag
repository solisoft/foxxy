<@{{object}}_edit>
  
  <h3>Editing @{{object}}</h3>
  <form onsubmit="{ save_form }" class="uk-form" id="form_@{{object}}">
  </form>

  <script>
    save_form(e) {
      common.checkLogin()
      common.saveForm("form_@{{object}}", "@{{object}}s", opts.@{{object}}_id)
    }

    var _this = this;    
    
    $.get(url + "@{{object}}s/" + opts.@{{object}}_id, function(d) {
      _this.@{{object}} = d.data      
      common.buildForm(_this.@{{object}}, d.fields, '#form_@{{object}}', '@{{object}}s')
    })
  </script>
</@{{object}}_edit>

<@{{object}}_new>
  <h3>Creating @{{object}}</h3>
  <form onsubmit="{ save_form }" class="uk-form" id="form_new_@{{object}}">
  </form>
  <script>
    this.on('update', function(eventName) {
      common.checkLogin()
    })
    
    save_form(e) {
      common.saveForm("form_new_@{{object}}", "@{{object}}s")
    }

    $.get(url + "@{{object}}s/fields", function(d) {
      common.buildForm({}, d.fields, '#form_new_@{{object}}', '@{{object}}s');
    })
  </script>
</@{{object}}_new>

<@{{objects}}>
  <h3>Listing @{{objects}}</h3>
  <a href="/#@{{object}}s/new" class="uk-button uk-button-mini"><i class="uk-icon-plus"></i> New @{{object}}</a>
  <table class="uk-table ">
    <thead>
      <tr>
        <th width="70"></th>
      </tr>
    </thead>
    <tbody>
      <tr each={ data } >
        <td class="uk-text-center">
          <a href="/#@{{object}}s/{ _key }/edit" class="uk-button uk-button-primary uk-button-mini"><i class="uk-icon-edit"></i></a>
          <a onclick={ destroy_object } class="uk-button uk-button-danger uk-button-mini"><i class="uk-icon-trash"></i></a>
        </td>
      </tr>    
    </tbody>
    
  </table>
  <script>

    var _this = this
    
    destroy_object(e) {
      
      UIkit.modal.confirm("Are you sure?", function() {
        $.ajax({
          url: url + "@{{object}}s/" + e.item._key,
          method: "DELETE"
        })
        $.get(url + "@{{object}}s/", function(d) {
          _this.data = d.data
          _this.update()
        })
      });
    }

    common.checkLogin()

    $.get(url + "@{{object}}s/", function(d) {
      _this.data = d.data
      _this.update()
    })
    
  </script>
</@{{objects}}>

