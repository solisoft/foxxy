var Common = {
  init: function init(){
    $.fn.serializeObject = function() {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
        if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
        } else {
          o[this.name] = this.value || '';
        }
      });
      return o;
    };
  },

  buildForm: function buildForm(obj, fields, formId, back_str) {
    var html = ""
    var uploads = []
    fields.forEach(function(l, i) {
      if (l.h !== undefined) {
        html += '<div uk-grid class="uk-grid-small uk-margin-top"><h3>'+ l.h +'</h3></div>'
      }
      else {
        if (l.r && i > 0) html += '</div>'
        if (l.r) html += '<div uk-grid class="uk-grid-small">'
        if (l.c.indexOf("uk-width") == -1) l.c = "uk-width-" + l.c

        html += '<div class="'+ l.c +'">'
        if (l.j._flags.presence === "required") {
          l.l = "<strong>" + l.l + "*</strong>"
        }
        if(!((l.t === "file" || l.t === "image") && obj._id === undefined))
          html += '<label for="" class="uk-form-label">'+ l.l +'</label>'
        var value = obj[l.n]
        if(value === undefined) value = ""
        if(l.t.match(/string/)) html += '<input type="'+(l.t.split(":").length == 2 ? l.t.split(":")[1] : "text")+'" id="'+l.n+'" class="uk-input" name="'+ l.n +'" value="'+value+'"><div data-hint="'+ l.n +'" class="uk-text-danger"></div>'
        if(l.t === "integer") html += '<input type="number" id="'+l.n+'" class="uk-input" name="'+ l.n +'" value="'+value+'"><div data-hint="'+ l.n +'" class="uk-text-danger"></div>'
        if(l.t === "date") html += '<div><div class="uk-inline"><span class="uk-form-icon" uk-icon="icon: calendar"></span><input type="date" id="'+l.n+'" data-date-format="YYYY/MM/DD" class="uk-input" name="'+ l.n +'"  value="'+value+'"></div><div data-hint="'+ l.n +'" class="uk-text-danger"></div></div>'
        if(l.t === "time") html += '<div><div class="uk-inline"><span class="uk-form-icon" uk-icon="icon: calendar"></span><input type="time" id="'+l.n+'" class="uk-input" name="'+ l.n +'"  value="'+value+'"></div><div data-hint="'+ l.n +'" class="uk-text-danger"></div></div>'
        if(l.t === "text") html += '<textarea id="'+l.n+'" class="uk-textarea" name="'+ l.n +'" style="'+l.s+'">'+ value +'</textarea><div data-hint="'+ l.n +'" class="uk-text-danger"></div>'
        if(l.t === "list") {
          html += '<select name="'+ l.n +'" style="width:100%" class="uk-select select_list" id="'+l.n+'">'
          l.d.forEach(function(o) {
            value = ""
            if(obj[l.n] === o[0]) value="selected='selected'"
            html += '<option value="'+ o[0] +'" '+value+'>'+ o[1] +'</option>'
          })
          html += '</select>'
        }
        if(l.t === "multilist") {
          html += '<select name="'+ l.n +'" style="width:100%" class="uk-select select_mlist" multiple="multiple" id="'+l.n+'">'
          l.d.forEach(function(o) {
            value = ""
            if(obj[l.n] && obj[l.n].indexOf(o[0]) >= 0) value="selected='selected'"
            html += '<option value="'+ o[0] +'" '+value+'>'+ o[1] +'</option>'
          })
          html += '</select>'
        }
        if(l.t === "tags") {
          html +='<select name="'+l.n+'" style="width:100%" class="select_tag" multiple="multiple">'
          l.d[0].forEach(function(o) {
            value = ""
            if(obj[l.n] && obj[l.n].indexOf(o) >= 0) value="selected='selected'"
            html += '<option value="'+ o +'" '+value+'>'+ o +'</option>'
          })
          html +='</select>'
        }
        if(l.t === "image" && obj._id) {
          html += '<div id="upload-drop_'+l.n+'" class="js-upload uk-placeholder uk-text-center">'
          html += '    <span uk-icon="icon: cloud-upload"></span>'
          html += '    <span class="uk-text-middle">Attach images by dropping them here or</span>'
          html += '    <div uk-form-custom>'
          html += '        <input type="file" multiple>'
          html += '        <span class="uk-link">selecting one</span>'
          html += '    </div>'
          html += '</div>'
          html += '<progress id="progressbar_'+l.n+'" class="uk-progress" value="0" max="100" hidden></progress>'

          html += '<images field="'+l.n+'" id="'+obj._id+'" />'
          uploads.push([obj._key, obj._id.split('/')[0], l.n, '*.(jpg|jpeg|gif|png)', 'progressbar_'+l.n, '#upload-drop_'+l.n])
        }
        if(l.t === "file" && obj._id) {
          html += '<div id="upload-drop_'+l.n+'" class="js-upload uk-placeholder uk-text-center">'
          html += '    <span uk-icon="icon: cloud-upload"></span>'
          html += '    <span class="uk-text-middle">Attach binaries by dropping them here or</span>'
          html += '    <div uk-form-custom>'
          html += '        <input type="file" multiple>'
          html += '        <span class="uk-link">selecting one</span>'
          html += '    </div>'
          html += '</div>'
          html += '<progress id="progressbar_'+l.n+'" class="uk-progress" value="0" max="100" hidden></progress>'
          html += '<files field="'+l.n+'" id="'+obj._id+'" />'
          uploads.push([obj._key, obj._id.split('/')[0], l.n, '*.*', 'progressbar_'+l.n, '#upload-drop_'+l.n])
        }
        if(l.t === "boolean") {
          var checked = obj[l.n] === true ? " checked='checked' " : ''
          html += ' <input name="'+ l.n +'" '+ checked +' type="checkbox" value="1"  /> '
        }
        html += '</div>'
      }
    })
    html += '</div>'
    html += '<hr><div uk-grid class="uk-grid-small uk-text-right"><div class="uk-width-1-1">'
    if (back_str != undefined) {
      html += '<a href="/#'+ back_str +'" class="uk-button uk-button-default">Back</a> '
    }
    html += '<button class="uk-button uk-button-primary">Save</button></div></div><hr>'

    $(formId).html(html)
    var _this = this
    uploads.forEach(function(u) {
      _this.prepare_upload(u[0], u[1], u[2], u[3], u[4], u[5])
    })
    riot.mount("images"); riot.mount("files")
    riot.update()
  },

  checkLogin: function checkLogin() {
    this.ajax(url + "auth/whoami", "GET", "", function(d) {
      if(d.username === null) document.location.href = "login.html";
    })
  },

  checkForm: function(formID, path, callback) {
    var json = JSON.stringify($("#"+ formID).serializeObject())
    $("div[data-hint]").html("")
    var errors = null
    this.ajax(url + path + "/check_form?data=" + json, "GET", "", function(d) {
      $("#"+ formID + " input, #"+ formID + " select").removeClass("uk-form-danger")
      $("#"+ formID + " input, #"+ formID + " select").removeClass("uk-form-success")
      $("#"+ formID + " input, #"+ formID + " select").addClass("uk-form-success")
      if(d.errors.length > 0) {
        errors = d.errors
        d.errors.forEach(function(e) {
          $("#" + e.path).removeClass("uk-form-success")
          $("#" + e.path).addClass("uk-form-danger")
          $("div[data-hint="+e.path+"]").html("<div>"+e.message.replace(/"(.*)"/, '').trim()+"</div>")
        })
      }

      setTimeout(function() {
        $("#"+ formID +" input, #"+ formID +" select").removeClass("uk-form-success")
      }, 300 )
      callback(errors)
    })
  },

  saveForm: function (formID, path, objID) {
    objID = objID||""
    var _this = this;
    var json = $("#"+ formID).serializeObject()
    $('.select_tag, .select_mlist').each(function(i, st) {
      if(typeof json[$(st).attr("name")] === "string") {
        json[$(st).attr("name")] = [ json[$(st).attr("name")] ]
      }
    })
    json = JSON.stringify(json)
    $("div[data-hint]").html("")
    _this.ajax(url + path + "/check_form?data=" + json, "GET", "", function(d) {
      $("#"+ formID + " input, #"+ formID + " select").removeClass("uk-form-danger")
      $("#"+ formID + " input, #"+ formID + " select").removeClass("uk-form-success")
      $("#"+ formID + " input, #"+ formID + " select").addClass("uk-form-success")
      if(d.errors.length > 0) {
        d.errors.forEach(function(e) {
          $("#" + e.path).removeClass("uk-form-success")
          $("#" + e.path).addClass("uk-form-danger")
          $("div[data-hint="+e.path+"]").html("<div>"+e.message.replace(/"(.*)"/, '').trim()+"</div>")
        })
      } else {
        _this.ajax(url + path + "/" + objID, "POST", json, function(d) {
          UIkit.notification({
            message : 'Successfully saved!',
            status  : 'success',
            timeout : 1000,
            pos     : 'bottom-right'
          });
          if(objID == "") {
            objID = d.key._key
            route("/"+ path +"/" + objID + "/edit")
          }
        })
      }
      setTimeout(function() {
        $("#"+ formID +" input, #"+ formID +" select").removeClass("uk-form-success")
      }, 300 )
    })
  },

  ajax: function(url, method, dataForm, callback, errorCallback) {
    if(typeof(errorCallback) === "undefined") errorCallback = function() {}
    $.ajax({
      url: url,
      data: dataForm || "",
      type: method,
      beforeSend: function(xhr){
        var x = localStorage.getItem('X-Session-Id')
        if(x !== null) {
          xhr.setRequestHeader('X-Session-Id', localStorage.getItem('X-Session-Id'))
        }
      },
      success: function(data, textStatus, request) {
        if(request.getResponseHeader('X-Session-Id'))
          localStorage.setItem('X-Session-Id',request.getResponseHeader('X-Session-Id'))
        callback(data)
      },
      statusCode: {
        401: function() { document.location.href = "login.html" },
        500: errorCallback(),
      }
    });
  },

  get: function(url, callback, errorCallback) {
    this.ajax(url, "GET", "", callback, errorCallback)
  },
  delete: function(url, callback, errorCallback) {
    this.ajax(url, "DELETE", "", callback, errorCallback)
  },
  post: function(url, json, callback, errorCallback) {
    this.ajax(url, "POST", json, callback, errorCallback)
  },
  patch: function(url, json, callback, errorCallback) {
    this.ajax(url, "PATCH", json, callback, errorCallback)
  },
  put: function(url, json, callback, errorCallback) {
    this.ajax(url, "PUT", json, callback, errorCallback)
  },

  array_diff: function(a, b) {
    return a.filter(function(i) {return b.indexOf(i) < 0;});
  },

  keys: function(h) {
    var keys = []
    for(var k in h) keys.push(k)
    return keys
  },

  prepare_upload: function(key, collection, field, filter, progressbar_id, drop_id) {

    var bar = document.getElementById(progressbar_id);

    UIkit.upload(drop_id, {

        url: url + '/uploads/' + key + '/' + collection + '/' + field, // upload url,
        multiple: true,
        headers: {
          'X-Session-Id': localStorage.getItem('X-Session-Id')
        },
        allow: filter,

        error: function () {
          UIkit.notification({
            message: arguments[0],
            status: 'danger',
            pos: 'top-right',
            timeout: 5000
          })
        },

        fail: function () {
          UIkit.notification({
            message: arguments[0],
            status: 'danger',
            pos: 'top-right',
            timeout: 5000
          })
        },


        loadStart: function (e) {
          bar.removeAttribute('hidden');
          bar.max = e.total;
          bar.value = e.loaded;
        },

        progress: function (e) {
          bar.max = e.total;
          bar.value = e.loaded;
        },

        loadEnd: function (e) {
          bar.max = e.total;
          bar.value = e.loaded;
        },

        completeAll: function () {
          bar.value = 100;
          setTimeout(function(){
            bar.setAttribute('hidden', null);
            riot.mount("images"); riot.mount("files")
            riot.update()

          }, 250);
        }

    });
  }

};

module.exports = Common;