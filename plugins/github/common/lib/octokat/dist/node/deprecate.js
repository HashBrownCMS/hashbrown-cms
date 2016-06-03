(function() {
  module.exports = function(message) {
    return typeof console !== "undefined" && console !== null ? typeof console.warn === "function" ? console.warn("Octokat Deprecation: " + message) : void 0 : void 0;
  };

}).call(this);
