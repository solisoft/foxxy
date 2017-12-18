<images>
  <div>
    <table if={ data.length > 0 } class="uk-table uk-table-striped uk-table-hover uk-table-small">
      <thead>
        <tr>
          <th>Picture</th>
          <th>Infos</th>
          <th class="uk-text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr each={ row in data } id="asset_{ row._key }">
          <td width="70"><img src="{ row.url }" alt=""></td>
          <td>{ row.filename.split('/')[row.filename.split('/').length - 1] }<br>{ prettyBytes(row.length) }</td>
          <td class="uk-text-center"><a onclick={ delete_asset } uk-icon="icon: trash"></a></td>
        </tr>
      </tbody>
    </table>
  </div>
  <script>
    var _this = this
    this.data = []
    var use_i18n = ""
    if(opts.i18n != "undefined") use_i18n = "/" + window.localStorage.getItem("foxx-locale")
    common.get(url + "uploads/" + opts.id + '/' + opts.field + use_i18n, function(d) {
      _this.data = d
      _this.update()
    })

    delete_asset(e) {
      UIkit.modal.confirm("Are you sure?").then(function() {
        common.delete(url + "uploads/" + e.item.row._key, function() {
          $('#asset_' + e.item.row._key).remove()
        })
      }, function() {})
    }
  </script>
</images>

<files>
  <div>
    <table if={ data.length > 0 } class="uk-table uk-table-striped uk-table-hover uk-table-small">
      <thead>
        <tr>
          <th>Filename</th>
          <th class="uk-text-center">Size</th>
          <th class="uk-text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr each={ row in data } id="asset_{ row._key }">
          <td>{ row.filename }</td>
          <td class="uk-text-center">{ prettyBytes(row.length) }</td>
          <td class="uk-text-center"><a onclick={ delete_asset } uk-icon="icon: trash"></a></td>
        </tr>
      </tbody>
    </table>
  </div>
  <script>
    var _this = this;
    this.data = []

    var use_i18n = ""
    if(opts.i18n != "undefined") use_i18n = "/" + window.localStorage.getItem("foxx-locale")

    common.get(url + "uploads/" + opts.id + '/' + opts.field + use_i18n, function(d) {
      _this.data = d
      _this.update()
    })

    delete_asset(e) {
      UIkit.modal.confirm("Are you sure?").then(function() {
        common.delete(url + "uploads/" + e.item.row._key, function() {
          $('#asset_' + e.item.row._key).remove()
        })
      }, function() {})
    }
  </script>
</files>