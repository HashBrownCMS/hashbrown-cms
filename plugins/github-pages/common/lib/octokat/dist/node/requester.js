(function() {
  var Requester, ajax, eventId, extend, filter, forEach, ref;

  ref = require('./plus'), filter = ref.filter, forEach = ref.forEach, extend = ref.extend;

  ajax = function(options, cb) {
    var XMLHttpRequest, name, ref1, req, value, xhr;
    if (typeof window !== "undefined" && window !== null) {
      XMLHttpRequest = window.XMLHttpRequest;
    } else {
      req = require;
      XMLHttpRequest = req('xmlhttprequest').XMLHttpRequest;
    }
    xhr = new XMLHttpRequest();
    xhr.dataType = options.dataType;
    if (typeof xhr.overrideMimeType === "function") {
      xhr.overrideMimeType(options.mimeType);
    }
    xhr.open(options.type, options.url);
    if (options.data && options.type !== 'GET') {
      xhr.setRequestHeader('Content-Type', options.contentType);
    }
    ref1 = options.headers;
    for (name in ref1) {
      value = ref1[name];
      xhr.setRequestHeader(name, value);
    }
    xhr.onreadystatechange = function() {
      var name1, ref2;
      if (4 === xhr.readyState) {
        if ((ref2 = options.statusCode) != null) {
          if (typeof ref2[name1 = xhr.status] === "function") {
            ref2[name1]();
          }
        }
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 || xhr.status === 302 || xhr.status === 0) {
          return cb(null, xhr);
        } else {
          return cb(xhr);
        }
      }
    };
    return xhr.send(options.data);
  };

  eventId = 0;

  module.exports = Requester = (function() {
    function Requester(_instance, _clientOptions, plugins) {
      var base, base1, base2;
      this._instance = _instance;
      this._clientOptions = _clientOptions != null ? _clientOptions : {};
      if ((base = this._clientOptions).rootURL == null) {
        base.rootURL = 'https://api.github.com';
      }
      if ((base1 = this._clientOptions).useETags == null) {
        base1.useETags = true;
      }
      if ((base2 = this._clientOptions).usePostInsteadOfPatch == null) {
        base2.usePostInsteadOfPatch = false;
      }
      if (typeof this._clientOptions.emitter === 'function') {
        this._emit = this._clientOptions.emitter;
      }
      this._pluginMiddleware = filter(plugins, function(arg) {
        var requestMiddleware;
        requestMiddleware = arg.requestMiddleware;
        return requestMiddleware;
      });
      this._plugins = plugins;
    }

    Requester.prototype.request = function(method, path, data, options, cb) {
      var acc, ajaxConfig, headers, mimeType;
      if (options == null) {
        options = {
          isRaw: false,
          isBase64: false,
          isBoolean: false,
          contentType: 'application/json'
        };
      }
      if (options == null) {
        options = {};
      }
      if (options.isRaw == null) {
        options.isRaw = false;
      }
      if (options.isBase64 == null) {
        options.isBase64 = false;
      }
      if (options.isBoolean == null) {
        options.isBoolean = false;
      }
      if (options.contentType == null) {
        options.contentType = 'application/json';
      }
      if (!/^http/.test(path)) {
        path = "" + this._clientOptions.rootURL + path;
      }
      headers = {
        'Accept': this._clientOptions.acceptHeader || 'application/json'
      };
      if (typeof window === "undefined" || window === null) {
        headers['User-Agent'] = 'octokat.js';
      }
      acc = {
        method: method,
        path: path,
        headers: headers,
        options: options,
        clientOptions: this._clientOptions
      };
      forEach(this._pluginMiddleware, function(plugin) {
        var mimeType, ref1;
        ref1 = plugin.requestMiddleware(acc) || {}, method = ref1.method, headers = ref1.headers, mimeType = ref1.mimeType;
        if (method) {
          acc.method = method;
        }
        if (mimeType) {
          acc.mimeType = mimeType;
        }
        return extend(acc.headers, headers);
      });
      method = acc.method, headers = acc.headers, mimeType = acc.mimeType;
      if (options.isRaw) {
        headers['Accept'] = 'application/vnd.github.raw';
      }
      ajaxConfig = {
        url: path,
        type: method,
        contentType: options.contentType,
        mimeType: mimeType,
        headers: headers,
        processData: false,
        data: !options.isRaw && data && JSON.stringify(data) || data,
        dataType: !options.isRaw ? 'json' : void 0
      };
      if (options.isBoolean) {
        ajaxConfig.statusCode = {
          204: (function(_this) {
            return function() {
              return cb(null, true);
            };
          })(this),
          404: (function(_this) {
            return function() {
              return cb(null, false);
            };
          })(this)
        };
      }
      eventId++;
      if (typeof this._emit === "function") {
        this._emit('start', eventId, {
          method: method,
          path: path,
          data: data,
          options: options
        });
      }
      return ajax(ajaxConfig, (function(_this) {
        return function(err, val) {
          var emitterRate, jqXHR, json, rateLimit, rateLimitRemaining, rateLimitReset;
          jqXHR = err || val;
          if (_this._emit) {
            if (jqXHR.getResponseHeader('X-RateLimit-Limit')) {
              rateLimit = parseFloat(jqXHR.getResponseHeader('X-RateLimit-Limit'));
              rateLimitRemaining = parseFloat(jqXHR.getResponseHeader('X-RateLimit-Remaining'));
              rateLimitReset = parseFloat(jqXHR.getResponseHeader('X-RateLimit-Reset'));
              emitterRate = {
                remaining: rateLimitRemaining,
                limit: rateLimit,
                reset: rateLimitReset
              };
              if (jqXHR.getResponseHeader('X-OAuth-Scopes')) {
                emitterRate.scopes = jqXHR.getResponseHeader('X-OAuth-Scopes').split(', ');
              }
            }
            _this._emit('end', eventId, {
              method: method,
              path: path,
              data: data,
              options: options
            }, jqXHR.status, emitterRate);
          }
          if (!err) {
            if (jqXHR.status === 302) {
              return cb(null, jqXHR.getResponseHeader('Location'));
            } else if (!(jqXHR.status === 204 && options.isBoolean)) {
              if (jqXHR.responseText && ajaxConfig.dataType === 'json') {
                data = JSON.parse(jqXHR.responseText);
              } else {
                data = jqXHR.responseText;
              }
              acc = {
                clientOptions: _this._clientOptions,
                plugins: _this._plugins,
                data: data,
                options: options,
                jqXHR: jqXHR,
                status: jqXHR.status,
                request: acc,
                requester: _this,
                instance: _this._instance
              };
              data = _this._instance._parseWithContext('', acc);
              return cb(null, data, jqXHR.status, jqXHR);
            }
          } else {
            if (options.isBoolean && jqXHR.status === 404) {

            } else {
              err = new Error(jqXHR.responseText);
              err.status = jqXHR.status;
              if (jqXHR.getResponseHeader('Content-Type') === 'application/json; charset=utf-8') {
                if (jqXHR.responseText) {
                  json = JSON.parse(jqXHR.responseText);
                } else {
                  json = '';
                }
                err.json = json;
              }
              return cb(err);
            }
          }
        };
      })(this));
    };

    return Requester;

  })();

}).call(this);
