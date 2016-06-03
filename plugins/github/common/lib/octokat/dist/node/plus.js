(function() {
  var filter, forEach, plus;

  filter = require('lodash/internal/arrayFilter');

  forEach = require('lodash/internal/arrayEach');

  plus = {
    camelize: function(string) {
      if (string) {
        return string.replace(/[_-]+(\w)/g, function(m) {
          return m[1].toUpperCase();
        });
      } else {
        return '';
      }
    },
    uncamelize: function(string) {
      if (!string) {
        return '';
      }
      return string.replace(/([A-Z])+/g, function(match, letter) {
        if (letter == null) {
          letter = '';
        }
        return "_" + (letter.toLowerCase());
      });
    },
    dasherize: function(string) {
      if (!string) {
        return '';
      }
      string = string[0].toLowerCase() + string.slice(1);
      return string.replace(/([A-Z])|(_)/g, function(m, letter) {
        if (letter) {
          return '-' + letter.toLowerCase();
        } else {
          return '-';
        }
      });
    },
    extend: function(target, source) {
      var i, key, len, ref, results;
      if (source) {
        ref = Object.keys(source);
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          key = ref[i];
          results.push(target[key] = source[key]);
        }
        return results;
      }
    },
    forOwn: function(obj, iterator) {
      var i, key, len, ref, results;
      ref = Object.keys(obj);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        results.push(iterator(obj[key], key));
      }
      return results;
    },
    filter: filter,
    forEach: forEach
  };

  module.exports = plus;

}).call(this);
