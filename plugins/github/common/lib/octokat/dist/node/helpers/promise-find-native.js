(function() {
  var allPromises, newPromise;

  if (typeof Promise !== "undefined" && Promise !== null) {
    newPromise = (function(_this) {
      return function(fn) {
        return new Promise(function(resolve, reject) {
          if (resolve.fulfill) {
            return fn(resolve.resolve.bind(resolve), resolve.reject.bind(resolve));
          } else {
            return fn.apply(null, arguments);
          }
        });
      };
    })(this);
    allPromises = (function(_this) {
      return function(promises) {
        return Promise.all(promises);
      };
    })(this);
  }

  module.exports = {
    newPromise: newPromise,
    allPromises: allPromises
  };

}).call(this);
