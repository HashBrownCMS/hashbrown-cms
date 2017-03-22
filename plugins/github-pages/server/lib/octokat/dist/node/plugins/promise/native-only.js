(function() {
  var UseNativePromises;

  module.exports = new (UseNativePromises = (function() {
    function UseNativePromises() {}

    UseNativePromises.prototype.promiseCreator = require('../../helpers/promise-find-native');

    return UseNativePromises;

  })());

}).call(this);
