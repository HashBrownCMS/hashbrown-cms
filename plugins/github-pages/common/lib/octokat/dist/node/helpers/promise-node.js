(function() {
  var Promise, allPromises, newPromise, req;

  req = require;

  Promise = this.Promise || req('es6-promise').Promise;

  newPromise = function(fn) {
    return new Promise(fn);
  };

  allPromises = function(promises) {
    return Promise.all(promises);
  };

  module.exports = {
    newPromise: newPromise,
    allPromises: allPromises
  };

}).call(this);
