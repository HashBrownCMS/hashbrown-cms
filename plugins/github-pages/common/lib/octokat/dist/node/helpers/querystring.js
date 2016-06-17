(function() {
  var toQueryString;

  toQueryString = function(options, omitQuestionMark) {
    var key, params, ref, value;
    if (!options || options === {}) {
      return '';
    }
    params = [];
    ref = options || {};
    for (key in ref) {
      value = ref[key];
      if (value) {
        params.push(key + "=" + (encodeURIComponent(value)));
      }
    }
    if (params.length) {
      if (omitQuestionMark) {
        return "&" + (params.join('&'));
      } else {
        return "?" + (params.join('&'));
      }
    } else {
      return '';
    }
  };

  module.exports = toQueryString;

}).call(this);
