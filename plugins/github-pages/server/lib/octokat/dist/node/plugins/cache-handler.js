(function() {
  var CacheHandler;

  module.exports = new (CacheHandler = (function() {
    function CacheHandler() {
      this._cachedETags = {};
    }

    CacheHandler.prototype.get = function(method, path) {
      return this._cachedETags[method + " " + path];
    };

    CacheHandler.prototype.add = function(method, path, eTag, data, status) {
      return this._cachedETags[method + " " + path] = {
        eTag: eTag,
        data: data,
        status: status
      };
    };

    CacheHandler.prototype.requestMiddleware = function(arg) {
      var cacheHandler, clientOptions, headers, method, path;
      clientOptions = arg.clientOptions, method = arg.method, path = arg.path;
      headers = {};
      cacheHandler = clientOptions.cacheHandler || this;
      if (cacheHandler.get(method, path)) {
        headers['If-None-Match'] = cacheHandler.get(method, path).eTag;
      } else {
        headers['If-Modified-Since'] = 'Thu, 01 Jan 1970 00:00:00 GMT';
      }
      return {
        headers: headers
      };
    };

    CacheHandler.prototype.responseMiddleware = function(arg) {
      var cacheHandler, clientOptions, data, eTag, jqXHR, method, path, ref, request, status;
      clientOptions = arg.clientOptions, request = arg.request, status = arg.status, jqXHR = arg.jqXHR, data = arg.data;
      if (!jqXHR) {
        return;
      }
      if (jqXHR) {
        method = request.method, path = request.path;
        cacheHandler = clientOptions.cacheHandler || this;
        if (status === 304 || status === 0) {
          ref = cacheHandler.get(method, path);
          if (ref) {
            data = ref.data, status = ref.status, eTag = ref.eTag;
            data.__IS_CACHED = eTag || true;
          } else {
            throw new Error('ERROR: Bug in Octokat cacheHandler. It had an eTag but not the cached response');
          }
        } else {
          if (method === 'GET' && jqXHR.getResponseHeader('ETag')) {
            eTag = jqXHR.getResponseHeader('ETag');
            cacheHandler.add(method, path, eTag, data, jqXHR.status);
          }
        }
        return {
          data: data,
          status: status
        };
      }
    };

    return CacheHandler;

  })());

}).call(this);
