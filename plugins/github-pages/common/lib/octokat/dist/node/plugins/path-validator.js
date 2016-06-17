(function() {
  var PathValidator, URL_VALIDATOR;

  URL_VALIDATOR = require('../grammar/url-validator');

  module.exports = new (PathValidator = (function() {
    function PathValidator() {}

    PathValidator.prototype.requestMiddleware = function(arg) {
      var err, path;
      path = arg.path;
      if (!URL_VALIDATOR.test(path)) {
        err = "Octokat BUG: Invalid Path. If this is actually a valid path then please update the URL_VALIDATOR. path=" + path;
        return console.warn(err);
      }
    };

    return PathValidator;

  })());

}).call(this);
