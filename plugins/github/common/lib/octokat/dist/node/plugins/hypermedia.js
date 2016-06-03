(function() {
  var HyperMedia, deprecate,
    slice = [].slice;

  deprecate = require('../deprecate');

  module.exports = new (HyperMedia = (function() {
    function HyperMedia() {}

    HyperMedia.prototype.replace = function(instance, data) {
      if (Array.isArray(data)) {
        return this._replaceArray(instance, data);
      } else if (typeof data === 'function') {
        return data;
      } else if (data instanceof Date) {
        return data;
      } else if (data === Object(data)) {
        return this._replaceObject(instance, data);
      } else {
        return data;
      }
    };

    HyperMedia.prototype._replaceObject = function(instance, orig) {
      var acc, i, key, len, ref, value;
      acc = {};
      ref = Object.keys(orig);
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        value = orig[key];
        this._replaceKeyValue(instance, acc, key, value);
      }
      return acc;
    };

    HyperMedia.prototype._replaceArray = function(instance, orig) {
      var arr, i, item, key, len, ref, value;
      arr = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = orig.length; i < len; i++) {
          item = orig[i];
          results.push(this.replace(instance, item));
        }
        return results;
      }).call(this);
      ref = Object.keys(orig);
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        value = orig[key];
        this._replaceKeyValue(instance, arr, key, value);
      }
      return arr;
    };

    HyperMedia.prototype._replaceKeyValue = function(instance, acc, key, value) {
      var defaultFn, fn, newKey;
      if (/_url$/.test(key)) {
        if (/^upload_url$/.test(key)) {
          defaultFn = function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            deprecate('call .upload({name, label}).create(data, contentType)' + ' instead of .upload(name, data, contentType)');
            return defaultFn.create.apply(defaultFn, args);
          };
          fn = function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return instance._fromUrlWithDefault.apply(instance, [value, defaultFn].concat(slice.call(args)))();
          };
        } else {
          defaultFn = function() {
            deprecate('instead of directly calling methods like .nextPage(), use .nextPage.fetch()');
            return this.fetch();
          };
          fn = instance._fromUrlCurried(value, defaultFn);
        }
        newKey = key.substring(0, key.length - '_url'.length);
        acc[newKey] = fn;
        if (!/\{/.test(value)) {
          return acc[key] = value;
        }
      } else if (/_at$/.test(key)) {
        return acc[key] = value ? new Date(value) : null;
      } else {
        return acc[key] = this.replace(instance, value);
      }
    };

    HyperMedia.prototype.responseMiddleware = function(arg) {
      var data, instance;
      instance = arg.instance, data = arg.data;
      data = this.replace(instance, data);
      return {
        data: data
      };
    };

    return HyperMedia;

  })());

}).call(this);
