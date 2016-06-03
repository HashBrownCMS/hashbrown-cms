(function() {
  var deprecate, toQueryString,
    slice = [].slice;

  toQueryString = require('./querystring');

  deprecate = require('../deprecate');

  module.exports = function() {
    var args, fieldName, fieldValue, i, j, k, len, len1, m, match, optionalNames, optionalParams, param, templateParams, url;
    url = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (args.length === 0) {
      templateParams = {};
    } else {
      if (args.length > 1) {
        deprecate('When filling in a template URL pass all the field to fill in 1 object instead of comma-separated args');
      }
      templateParams = args[0];
    }
    i = 0;
    while (m = /(\{[^\}]+\})/.exec(url)) {
      match = m[1];
      param = '';
      switch (match[1]) {
        case '/':
          fieldName = match.slice(2, match.length - 1);
          fieldValue = templateParams[fieldName];
          if (fieldValue) {
            if (/\//.test(fieldValue)) {
              throw new Error("Octokat Error: this field must not contain slashes: " + fieldName);
            }
            param = "/" + fieldValue;
          }
          break;
        case '+':
          fieldName = match.slice(2, match.length - 1);
          fieldValue = templateParams[fieldName];
          if (fieldValue) {
            param = fieldValue;
          }
          break;
        case '?':
          optionalNames = match.slice(2, -1).split(',');
          optionalParams = {};
          for (j = 0, len = optionalNames.length; j < len; j++) {
            fieldName = optionalNames[j];
            optionalParams[fieldName] = templateParams[fieldName];
          }
          param = toQueryString(optionalParams);
          break;
        case '&':
          optionalNames = match.slice(2, -1).split(',');
          optionalParams = {};
          for (k = 0, len1 = optionalNames.length; k < len1; k++) {
            fieldName = optionalNames[k];
            optionalParams[fieldName] = templateParams[fieldName];
          }
          param = toQueryString(optionalParams, true);
          break;
        default:
          fieldName = match.slice(1, match.length - 1);
          if (templateParams[fieldName]) {
            param = templateParams[fieldName];
          } else {
            throw new Error("Octokat Error: Required parameter is missing: " + fieldName);
          }
      }
      url = url.replace(match, param);
      i++;
    }
    return url;
  };

}).call(this);
