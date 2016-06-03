(function() {
  var CamelCase, plus;

  plus = require('../plus');

  module.exports = new (CamelCase = (function() {
    function CamelCase() {}

    CamelCase.prototype.responseMiddleware = function(arg) {
      var data;
      data = arg.data;
      data = this.replace(data);
      return {
        data: data
      };
    };

    CamelCase.prototype.replace = function(data) {
      if (Array.isArray(data)) {
        return this._replaceArray(data);
      } else if (typeof data === 'function') {
        return data;
      } else if (data instanceof Date) {
        return data;
      } else if (data === Object(data)) {
        return this._replaceObject(data);
      } else {
        return data;
      }
    };

    CamelCase.prototype._replaceObject = function(orig) {
      var acc, i, key, len, ref, value;
      acc = {};
      ref = Object.keys(orig);
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        value = orig[key];
        this._replaceKeyValue(acc, key, value);
      }
      return acc;
    };

    CamelCase.prototype._replaceArray = function(orig) {
      var arr, i, item, key, len, ref, value;
      arr = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = orig.length; i < len; i++) {
          item = orig[i];
          results.push(this.replace(item));
        }
        return results;
      }).call(this);
      ref = Object.keys(orig);
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        value = orig[key];
        this._replaceKeyValue(arr, key, value);
      }
      return arr;
    };

    CamelCase.prototype._replaceKeyValue = function(acc, key, value) {
      return acc[plus.camelize(key)] = this.replace(value);
    };

    return CamelCase;

  })());

}).call(this);
