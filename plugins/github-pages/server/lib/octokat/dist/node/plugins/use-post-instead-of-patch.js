(function() {
  var UsePostInsteadOfPatch;

  module.exports = new (UsePostInsteadOfPatch = (function() {
    function UsePostInsteadOfPatch() {}

    UsePostInsteadOfPatch.prototype.requestMiddleware = function(arg) {
      var method, ref, usePostInsteadOfPatch;
      (ref = arg.clientOptions, usePostInsteadOfPatch = ref.usePostInsteadOfPatch), method = arg.method;
      if (usePostInsteadOfPatch && method === 'PATCH') {
        return {
          method: 'POST'
        };
      }
    };

    return UsePostInsteadOfPatch;

  })());

}).call(this);
