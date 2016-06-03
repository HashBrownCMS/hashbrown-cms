(function() {
  var ReadBinary, toQueryString;

  toQueryString = require('../helpers/querystring');

  module.exports = new (ReadBinary = (function() {
    function ReadBinary() {}

    ReadBinary.prototype.verbs = {
      readBinary: function(path, query) {
        return {
          method: 'GET',
          path: "" + path + (toQueryString(query)),
          options: {
            isRaw: true,
            isBase64: true
          }
        };
      }
    };

    ReadBinary.prototype.requestMiddleware = function(arg) {
      var isBase64, options;
      options = arg.options;
      if (options) {
        isBase64 = options.isBase64;
        if (isBase64) {
          return {
            headers: {
              Accept: 'application/vnd.github.raw'
            },
            mimeType: 'text/plain; charset=x-user-defined'
          };
        }
      }
    };

    ReadBinary.prototype.responseMiddleware = function(arg) {
      var converted, data, i, isBase64, j, options, ref;
      options = arg.options, data = arg.data;
      if (options) {
        isBase64 = options.isBase64;
        if (isBase64) {
          converted = '';
          for (i = j = 0, ref = data.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            converted += String.fromCharCode(data.charCodeAt(i) & 0xff);
          }
          return {
            data: converted
          };
        }
      }
    };

    return ReadBinary;

  })());

}).call(this);
