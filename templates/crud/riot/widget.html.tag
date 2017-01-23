<@{{object}}_edit>
  
  <h3>Editing @{{object}}</h3>
  <form onsubmit="{ save_form }" class="uk-form" id="form_@{{object}}">
  </form>

  <script>
    save_form(e) {
      common.saveForm("form_@{{object}}", "@{{objects}}", opts.@{{object}}_id)
    }

    var _this = this;    
    
    common.get(url + "@{{objects}}/" + opts.@{{object}}_id, function(d) {
      _this.@{{object}} = d.data      
      common.buildForm(_this.@{{object}}, d.fields, '#form_@{{object}}', '@{{objects}}')
    })
    this.on('updated', function() { $("select").select2() })
  </script>
</@{{object}}_edit>

<@{{object}}_new>
  <h3>Creating @{{object}}</h3>
  <form onsubmit="{ save_form }" class="uk-form" id="form_new_@{{object}}">
  </form>
  <script>
    save_form(e) {
      common.saveForm("form_new_@{{object}}", "@{{objects}}")
    }

    common.get(url + "@{{objects}}/fields", function(d) {
      common.buildForm({}, d.fields, '#form_new_@{{object}}', '@{{objects}}');
    })
    this.on('updated', function() { $("select").select2() })
  </script>
</@{{object}}_new>

<@{{objects}}>
  <h3>Listing @{{objects}}</h3>
  <a href="/#@{{objects}}/new" class="uk-button uk-button-mini"><i class="uk-icon-plus"></i> New @{{object}}</a>
  <form onsubmit={filter} class="uk-form uk-margin-top">
    <div class="uk-form-icon uk-width-1-1">
      <i class="uk-icon-search"></i>
      <input type="text" name="term" id="term" class="uk-width-1-1" autocomplete="off">
    </div>
  </form>
  <table class="uk-table uk-table-striped">
    <thead>
      <tr>
        <th each={ col in cols }>{col}</th>
        <th width="70"></th>
      </tr>
    </thead>
    <tbody>
      <tr each={ row in data } >
        <td each={ col in cols }>{row[col]}</td>
        <td class="uk-text-center">
          <a onclick={edit} class="uk-button uk-button-primary uk-button-mini"><i class="uk-icon-edit"></i></a>
          <a onclick={ destroy_object } class="uk-button uk-button-danger uk-button-mini"><i class="uk-icon-trash"></i></a>
        </td>
      </tr>    
    </tbody>
    
  </table>
  <ul show={count > per_page} class="uk-pagination" ></ul>

  <script>

    var _this = this
    
    this.loadFirstPage = function() {
      common.get(url + "@{{objects}}/page/1", function(d) {
        _this.data = d.data[0].users
        _this.cols = _.difference(_.keys(_this.data[0]), ["_id", "_key", "_rev"])
        _this.count = d.data[0].count
        UIkit.pagination(".uk-pagination", { items: _this.count, itemsOnPage: per_page });
        _this.update()
      })  
    }
    this.loadFirstPage()

    filter(e) {
      if(_this.term.value != "") {
        $(".uk-form-icon i").attr("class", "uk-icon-spin uk-icon-spinner")
        common.get(url + "@{{objects}}/search/"+_this.term.value, function(d) {
          _this.data = d.data
          $(".uk-pagination").hide()
          $(".uk-form-icon i").attr("class", "uk-icon-search")
          _this.update()
        })
      }        
      else {
        $(".uk-pagination").show()
        _this.loadFirstPage()
      }
    }

    edit(e) {
      riot.route("/@{{objects}}/" + e.item.row._key + "/edit")
    }

    destroy_object(e) {      
      UIkit.modal.confirm("Are you sure?", function() {
        common.delete(url + "@{{objects}}/" + e.item.row._key, function() {
          common.get(url + "@{{objects}}/page/1", function(d) {
            _this.data = d.data[0].users
            _this.count = d.data[0].count
            _this.update()
          })    
        })
      });
    }

    $('body').on('select.uk.pagination', '.uk-pagination', function(e, pageIndex){
        common.get(url + "@{{objects}}/page/" + (pageIndex+1), function(d) {
          _this.data = d.data[0].users
          _this.count = d.data[0].count
          _this.update()
        })
    });
    
  </script>
</@{{objects}}>

