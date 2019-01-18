<@{{object}}_crud_index>

  <a href="#" class="uk-button uk-button-small uk-button-default" onclick={ new_item }>New { opts.singular }</a>

  <table class="uk-table uk-table-striped" if={data.length > 0}>
    <thead>
      <tr>
        <th each={ col in cols }>
          {col.name == undefined ? col : col.label === undefined ? col.name : col.label}
        </th>
        <th width="70"></th>
      </tr>
    </thead>
    <tbody>
      <tr each={ row in data } >
        <td each={ col in cols } class="{col.class}">
          <virtual if={ col.tr == true }>{_.get(row,col.name)[locale]}</virtual>
          <virtual if={ col.tr != true }>{_.get(row,col.name)}</virtual>
        </td>
        <td class="uk-text-center" width="110">
          <a onclick={edit} class="uk-button uk-button-primary uk-button-small" uk-icon="icon: pencil"></a>
          <a onclick={ destroy_object } class="uk-button uk-button-danger uk-button-small" uk-icon="icon: trash"></a>
        </td>
      </tr>
    </tbody>

  </table>

  <ul class="uk-pagination">
    <li if={ page > 0 } ><a onclick={ previousPage }><span class="uk-margin-small-right" uk-pagination-previous></span> Previous</a></li>
    <li if={ (page + 1) * perpage < count} class="uk-margin-auto-left"><a onclick={ nextPage }>Next <span class="uk-margin-small-left" uk-pagination-next></span></a></li>
  </ul>

  <script>
    var _this = this
    this.data = []
    new_item(e) {
      e.preventDefault()
      riot.mount("#"+opts.id, "@{{object}}_crud_new", opts)
    }

    this.loadPage = function(pageIndex) {
      common.get(url + "/cruds/sub/"+opts.parent_id+"/"+opts.id+"/"+opts.key+"/page/"+pageIndex+"/"+per_page, function(d) {
        _this.data = d.data[0].data
        _this.cols = _.map(common.array_diff(common.keys(_this.data[0]), ["_id", "_key", "_rev"]), function(v) { return { name: v }})
        if(opts.columns) _this.cols = opts.columns
        _this.count = d.data[0].count
        _this.update()
      })
    }
    this.loadPage(1)

    edit(e) {
      e.preventDefault()
      opts.element_id = e.item.row._key
      riot.mount("#"+opts.id, "@{{object}}_crud_edit", opts)
    }

    nextPage(e) {
      e.preventDefault()
      _this.page += 1
      _this.loadPage(_this.page + 1)
    }

    previousPage(e) {
      e.preventDefault()
      _this.page -= 1
      _this.loadPage(_this.page + 1)
    }

    destroy_object(e) {
      e.preventDefault()
      UIkit.modal.confirm("Are you sure?").then(function() {
        common.delete(url + "/cruds/" + opts.id + "/" + e.item.row._key, function() {
          _this.loadPage(1)
        })
      }, function() {})
    }
  </script>
</@{{object}}_crud_index>

<@{{object}}_crud_edit>
  <a href="#" class="uk-button uk-button-link" onclick={ goback }>Back to { opts.id }</a>
  <form onsubmit="{ save_form }" class="uk-form" id="{opts.id}_crud_@{{object}}">
  </form>

  <script>
    goback(e) {
      e.preventDefault()
      riot.mount("#"+opts.id, "@{{object}}_crud_index", opts)
    }

    save_form(e) {
      e.preventDefault()
      common.saveForm(opts.id+'_crud_@{{object}}', "cruds/sub/"+opts.parent_name+"/"+ opts.id+"/"+opts.element_id, "", opts)
    }

    var _this = this;
    common.get(url + "/cruds/" + opts.id + "/" + opts.element_id, function(d) {
      _this.@{{object}} = d.data

      common.buildForm(_this.@{{object}}, opts.fields, '#'+opts.id+'_crud_@{{object}}')
    })
    this.on('updated', function() {
      $(".select_list").select2()
      $(".select_mlist").select2()
      $(".select_tag").select2({ tags: true })
    })
  </script>
</@{{object}}_crud_edit>

<@{{object}}_crud_new>
  <a href="#" class="uk-button uk-button-link" onclick={ goback }>Back to { opts.id }</a>
  <form onsubmit="{ save_form }" class="uk-form" id="{opts.id}_crud_@{{object}}">
  </form>

  <script>
    var _this = this
    this.crud = {}
    this.crud[opts.key] = opts.parent_id

    goback(e) {
      e.preventDefault()
      riot.mount("#"+opts.id, "@{{object}}_crud_index", opts)
    }

    this.on('mount', function() {
      common.buildForm(_this.crud, opts.fields, '#'+opts.id+'_crud_@{{object}}')
    })

    save_form(e) {
      e.preventDefault()
      common.saveForm(opts.id+'_crud_@{{object}}', "cruds/sub/@{{objects}}/"+ opts.id, "", opts)
    }


  </script>
</@{{object}}_crud_new>

<@{{object}}_edit>

  <ul uk-tab>
    <li><a href="#">@{{objects}}</a></li>
    <li each={ i, k in sub_models }><a href="#">{ k }</a></li>
  </ul>

  <ul class="uk-switcher uk-margin">
    <li>
      <h3>Editing @{{object}}</h3>
      <form onsubmit="{ save_form }" class="uk-form" id="form_@{{object}}">
      </form>
      <a class="uk-button uk-button-secondary" onclick="{ duplicate }">Duplicate</a>
    </li>
    <li each={ i, k in sub_models }>
      <div id={ k } class="crud"></div>
    </li>
  </ul>

  <script>
    save_form(e) {
      e.preventDefault()
      common.saveForm("form_@{{object}}", "cruds/@{{objects}}",opts.@{{object}}_id)
    }

    duplicate(e) {
      UIkit.modal.confirm("Are you sure?").then(function() {
        common.get(url + "/cruds/@{{objects}}/" + _this.product._key + "/duplicate", function(data) {
          route('/@{{objects}}/' + data._key + '/edit')
          UIkit.notification({
            message : 'Successfully duplicated!',
            status  : 'success',
            timeout : 1000,
            pos     : 'bottom-right'
          });
        })
      }, function() {})
    }

    var _this = this;
    common.get(url + "/cruds/@{{objects}}/" + opts.@{{object}}_id, function(d) {
      _this.@{{object}} = d.data
      _this.fields = d.fields
      _this.sub_models = d.fields.sub_models
      var fields = d.fields

      if(!_.isArray(fields)) fields = fields.model

      common.buildForm(_this.@{{object}}, fields, '#form_@{{object}}', '@{{objects}}', function() {
          $(".crud").each(function(i, c) {
          var id = $(c).attr("id")
          riot.mount("#" + id, "@{{object}}_crud_index", { model: id,
            fields: _this.sub_models[id].fields,
            key: _this.sub_models[id].key,
            singular: _this.sub_models[id].singular,
            columns: _this.sub_models[id].columns,
            parent_id: opts.@{{object}}_id,
            parent_name: "@{{objects}}" })
         })
      })
    })

    this.on('updated', function() {
      $(".select_list").select2()
      $(".select_mlist").select2()
      $(".select_tag").select2({ tags: true })
    })
  </script>
</@{{object}}_edit>

<@{{object}}_new>
  <h3>Creating @{{object}}</h3>
  <form onsubmit="{ save_form }" class="uk-form" id="form_new_@{{object}}">
  </form>
  <script>
    save_form(e) {
      e.preventDefault()
      common.saveForm("form_new_@{{object}}", "cruds/@{{objects}}")
    }

    common.get(url + "/cruds/@{{objects}}/fields", function(d) {
      // Ignore sub models if any
      var fields = d.fields
      if(!_.isArray(fields)) fields = fields.model
      common.buildForm({}, fields, '#form_new_@{{object}}', '@{{objects}}');
    })

    this.on('updated', function() {
      $(".select_list").select2()
      $(".select_mlist").select2()
      $(".select_tag").select2({ tags: true })
    })
  </script>
</@{{object}}_new>

<@{{objects}}>
  <div class="uk-float-right">
    <a href="#@{{objects}}/new" class="uk-button uk-button-small uk-button-default">New @{{object}}</a>
    <a if={ export } onclick="{ export_data }" class="uk-button uk-button-small uk-button-primary">Export CSV</a>
  </div>
  <h3>Listing @{{objects}}</h3>

  <form onsubmit={filter} class="uk-margin-top">
    <div class="uk-inline uk-width-1-1">
      <span class="uk-form-icon" uk-icon="icon: search"></span>
      <input type="text" ref="term" id="term" class="uk-input" autocomplete="off">
    </div>
  </form>
  <table class="uk-table uk-table-striped">
    <thead>
      <tr>
        <th each={ col in cols }>{col.name == undefined ? col : col.label === undefined ? col.name : col.label}</th>
        <th width="70"></th>
      </tr>
    </thead>
    <tbody>
      <tr each={ row in data } >
        <td each={ col in cols } class="{col.class}">
          <virtual if={ col.toggle == true } >
            <virtual if={ col.tr == true }><a onclick={toggleField} data-key="{row._key}">{col.values ? col.values[row[col.name][locale]] : _.get(row,col.name)[locale]}</a></virtual>
            <virtual if={ col.tr != true }><a onclick={toggleField} data-key="{row._key}">{col.values ? col.values[row[col.name]] : _.get(row,col.name) }</a></virtual>
          </virtual>

          <virtual if={ col.toggle != true } >
            <virtual if={ col.type == "image" }>
              <img src="{_.get(row,col.name)[locale]} " style="height:25px">
            </virtual>
            <virtual if={ col.type != "image" }>
              { calc_value(row, col, locale) }
            </virtual>
          </virtual>
        </td>
        <td class="uk-text-center" width="110">
          <a onclick={edit} class="uk-button uk-button-primary uk-button-small" uk-icon="icon: pencil"></a>
          <a onclick={ destroy_object } class="uk-button uk-button-danger uk-button-small" uk-icon="icon: trash"></a>
        </td>
      </tr>
    </tbody>

  </table>
  <ul class="uk-pagination">
    <li if={ page > 0 } ><a onclick={ previousPage }><span class="uk-margin-small-right" uk-pagination-previous></span> Previous</a></li>
    <li if={ (page + 1) * perpage < count} class="uk-margin-auto-left"><a onclick={ nextPage }>Next <span class="uk-margin-small-left" uk-pagination-next></span></a></li>
  </ul>
  Per Page : {perpage}
  <a onclick={ setPerPage } class="uk-label">25</a>
  <a onclick={ setPerPage } class="uk-label">50</a>
  <a onclick={ setPerPage } class="uk-label">100</a>
  <script>

    var _this     = this
    this.page     = 0
    this.perpage  = per_page
    this.locale   = window.localStorage.getItem('foxx-locale')
    this.data     = []
    this.export   = false

    this.loadPage = function(pageIndex) {
      common.get(url + "/cruds/@{{objects}}/page/"+pageIndex+"/"+this.perpage, function(d) {
        _this.data = d.data[0].data
        _this.export = !!d.data[0].export
        _this.cols = _.map(common.array_diff(common.keys(_this.data[0]), ["_id", "_key", "_rev"]), function(v) { return { name: v }})
        if(d.model.columns) _this.cols = d.model.columns
        _this.count = d.data[0].count
        _this.update()
      })
    }
    this.loadPage(1)

    ////////////////////////////////////////////////////////////////////////////
    calc_value(row, col, locale) {
      value = _.get(row, col.name)
      if(col.tr) { value = value[locale] }
      if(col.truncate) { value = value.substring(0,col.truncate) }
      if(col.capitalize) { value = _.capitalize(value) }
      if(col.uppercase) { value = _.toUpper(value) }
      if(col.downcase) { value = _.toLower(value) }
      return value
    }

    ////////////////////////////////////////////////////////////////////////////
    filter(e) {
      e.preventDefault();
      if(_this.refs.term.value != "") {
        $(".uk-form-icon i").attr("class", "uk-icon-spin uk-icon-spinner")
        common.get(url + "/cruds/@{{objects}}/search/"+_this.refs.term.value, function(d) {
          _this.data = d.data
          $(".uk-form-icon i").attr("class", "uk-icon-search")
          _this.update()
        })
      }
      else {
        _this.loadPage(1)
      }
    }

    ////////////////////////////////////////////////////////////////////////////
    edit(e) {
      route("/@{{objects}}/" + e.item.row._key + "/edit")
    }

    ////////////////////////////////////////////////////////////////////////////
    nextPage(e) {
      _this.page += 1
      _this.loadPage(_this.page + 1)
    }

    ////////////////////////////////////////////////////////////////////////////
    previousPage(e) {
      _this.page -= 1
      _this.loadPage(_this.page + 1)
    }

    ////////////////////////////////////////////////////////////////////////////
    destroy_object(e) {
      UIkit.modal.confirm("Are you sure?").then(function() {
        common.delete(url + "/cruds/@{{objects}}/" + e.item.row._key, function() {
          _this.loadPage(_this.page)
        })
      }, function() {})
    }

    ////////////////////////////////////////////////////////////////////////////
    toggleField(e) {
      e.preventDefault()
      common.patch(url + "/cruds/products/" + e.target.dataset.key + "/" + e.item.col.name + "/toggle", "{}", function(data) {
        if(data.success) {
          e.target.innerText = data.data
        }
      })
    }

    ////////////////////////////////////////////////////////////////////////////
    setPerPage(e) {
      e.preventDefault()
      this.perpage = parseInt(e.srcElement.innerText)
      this.loadPage(1)
    }

    ////////////////////////////////////////////////////////////////////////////
    export_data(e) {
      common.get(url + '/cruds/@{{objects}}/export', function(d) {
        var csvContent = d.data
        var encodedUri = encodeURI(csvContent)
        var link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "@{{objects}}.csv")
        link.innerHTML= "Click Here to download"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    }
  </script>
</@{{objects}}>

