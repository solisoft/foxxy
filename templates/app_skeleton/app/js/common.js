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
    var html = "";
    fields.forEach(function(l, i) {
      if (l.h !== undefined) {
        html += '<div class="uk-grid uk-grid-small uk-margin-top"><h3>'+ l.h +'</h3></div>'
      }
      else {
        if (l.r && i > 0) html += '</div>'
        if (l.r) html += '<div class="uk-grid uk-grid-small">'
        if (l.c.indexOf("uk-width") == -1) l.c = "uk-width-" + l.c

        html += '<div class="'+ l.c +'">'
        if (l.j._flags.presence === "required") {
          l.l = "<strong>" + l.l + "*</strong>"
        }
        html += '<label for="" class="uk-form-label">'+ l.l +'</label>'
        var value = obj[l.n]
        if(value === undefined) value = ""
        if(l.t === "string") html += '<input type="text" id="'+l.n+'" class="uk-width-1-1" name="'+ l.n +'" value="'+value+'"><div data-hint="'+ l.n +'" class="uk-text-danger"></div>'
        if(l.t === "date") html += '<div class="uk-form-icon uk-width-1-1"><i class="uk-icon-calendar"></i><input type="text" id="'+l.n+'" class="uk-width-1-1" name="'+ l.n +'" data-uk-datepicker="{format:\'DD-MM-YYYY\'}" value="'+value+'"></div><div data-hint="'+ l.n +'" class="uk-text-danger"></div>'
          if(l.t === "time") html += '<div class="uk-form-icon uk-width-1-1"><i class="uk-icon-clock-o"></i><input type="text" id="'+l.n+'" class="uk-width-1-1" name="'+ l.n +'" data-uk-timepicker value="'+value+'"></div><div data-hint="'+ l.n +'" class="uk-text-danger"></div>'
        if(l.t === "text") html += '<textarea id="'+l.n+'" class="uk-width-1-1" name="'+ l.n +'" style="'+l.s+'">'+ value +'</textarea><div data-hint="'+ l.n +'" class="uk-text-danger"></div>'
        if(l.t === "list") {
          html += '<select name="'+ l.n +'" class="uk-width-1-1" id="'+l.n+'">'
          l.d.forEach(function(o) {
            value = ""
            if(obj[l.n] === o[0]) value="selected='selected'"
            html += '<option value="'+ o[0] +'" '+value+'>'+ o[1] +'</option>'
          })
          html += '</select>'
        }
        html += '</div>'
      }
    })
    html += '</div>'
    html += '<hr><div class="uk-grid uk-grid-small uk-text-right"><div class="uk-width-1-1">'
    if (back_str != undefined) {
      html += '<a href="/#'+ back_str +'" class="uk-button"><i class="uk-icon-chevron-left"></i> Back</a> '
    }
    html += '<button class="uk-button uk-button-success"><i class="uk-icon-save"></i> Save</button></div></div><hr>'

    $(formId).html(html)
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
          $("div[data-hint="+e.path+"]").html("<div>"+e.message+"</div>")
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
    var json = JSON.stringify($("#"+ formID).serializeObject())
    $("div[data-hint]").html("")
    _this.ajax(url + path + "/check_form?data=" + json, "GET", "", function(d) {
      $("#"+ formID + " input, #"+ formID + " select").removeClass("uk-form-danger")
      $("#"+ formID + " input, #"+ formID + " select").removeClass("uk-form-success")
      $("#"+ formID + " input, #"+ formID + " select").addClass("uk-form-success")
      if(d.errors.length > 0) {
        d.errors.forEach(function(e) {
          $("#" + e.path).removeClass("uk-form-success")
          $("#" + e.path).addClass("uk-form-danger")
          $("div[data-hint="+e.path+"]").html("<div>"+e.message+"</div>")
        })
      } else {
        _this.ajax(url + path + "/" + objID, "POST", json, function(d) {
          UIkit.notify({
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

  get: function(url, callback) {
    this.ajax(url, "GET", "", callback)
  },
  delete: function(url, callback) {
    this.ajax(url, "DELETE", "", callback)
  },
  post: function(url, json, callback) {
    this.ajax(url, "POST", json, callback)
  },
  patch: function(url, json, callback) {
    this.ajax(url, "PATCH", json, callback)
  },
  put: function(url, json, callback) {
    this.ajax(url, "PUT", json, callback)
  },

  array_diff: function(a, b) {
    return a.filter(function(i) {return b.indexOf(i) < 0;});
  },

  keys: function(h) {
    var keys = []
    for(var k in h) keys.push(k)
    return keys
  }

};

module.exports = Common;