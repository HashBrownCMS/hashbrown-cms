(function() {
  var Authorization, base64encode;

  base64encode = require('../helpers/base64');

  module.exports = new (Authorization = (function() {
    function Authorization() {}

    Authorization.prototype.requestMiddleware = function(arg) {
      var auth, password, ref, token, username;
      ref = arg.clientOptions, token = ref.token, username = ref.username, password = ref.password;
      if (token || (username && password)) {
        if (token) {
          auth = "token " + token;
        } else {
          auth = 'Basic ' + base64encode(username + ":" + password);
        }
        return {
          headers: {
            'Authorization': auth
          }
        };
      }
    };

    return Authorization;

  })());

}).call(this);
