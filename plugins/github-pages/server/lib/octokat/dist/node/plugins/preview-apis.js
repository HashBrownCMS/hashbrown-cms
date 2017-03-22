(function() {
  var DEFAULT_HEADER, PREVIEW_HEADERS, PreviewApis;

  PREVIEW_HEADERS = require('../grammar/preview-headers');

  DEFAULT_HEADER = function(url) {
    var key, val;
    for (key in PREVIEW_HEADERS) {
      val = PREVIEW_HEADERS[key];
      if (val.test(url)) {
        return key;
      }
    }
  };

  module.exports = new (PreviewApis = (function() {
    function PreviewApis() {}

    PreviewApis.prototype.requestMiddleware = function(arg) {
      var acceptHeader, path;
      path = arg.path;
      acceptHeader = DEFAULT_HEADER(path);
      if (acceptHeader) {
        return {
          headers: {
            'Accept': acceptHeader
          }
        };
      }
    };

    return PreviewApis;

  })());

}).call(this);
