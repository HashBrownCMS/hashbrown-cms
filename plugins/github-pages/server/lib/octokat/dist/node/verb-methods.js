(function() {
  var VerbMethods, extend, filter, forOwn, ref, toPromise, toQueryString,
    slice = [].slice;

  ref = require('./plus'), filter = ref.filter, forOwn = ref.forOwn, extend = ref.extend;

  toQueryString = require('./helpers/querystring');

  toPromise = function(orig, newPromise) {
    return function() {
      var args, last;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      last = args[args.length - 1];
      if (typeof last === 'function') {
        args.pop();
        return orig.apply(null, [last].concat(slice.call(args)));
      } else if (newPromise) {
        return newPromise(function(resolve, reject) {
          var cb;
          cb = function(err, val) {
            if (err) {
              return reject(err);
            }
            return resolve(val);
          };
          return orig.apply(null, [cb].concat(slice.call(args)));
        });
      } else {
        throw new Error('You must specify a callback or have a promise library loaded');
      }
    };
  };

  module.exports = VerbMethods = (function() {
    function VerbMethods(plugins, _requester) {
      var i, j, len, len1, plugin, promisePlugins, ref1, ref2;
      this._requester = _requester;
      if (!this._requester) {
        throw new Error('Octokat BUG: request is required');
      }
      promisePlugins = filter(plugins, function(arg) {
        var promiseCreator;
        promiseCreator = arg.promiseCreator;
        return promiseCreator;
      });
      if (promisePlugins) {
        this._promisePlugin = promisePlugins[0];
      }
      this._syncVerbs = {};
      ref1 = filter(plugins, function(arg) {
        var verbs;
        verbs = arg.verbs;
        return verbs;
      });
      for (i = 0, len = ref1.length; i < len; i++) {
        plugin = ref1[i];
        extend(this._syncVerbs, plugin.verbs);
      }
      this._asyncVerbs = {};
      ref2 = filter(plugins, function(arg) {
        var asyncVerbs;
        asyncVerbs = arg.asyncVerbs;
        return asyncVerbs;
      });
      for (j = 0, len1 = ref2.length; j < len1; j++) {
        plugin = ref2[j];
        extend(this._asyncVerbs, plugin.asyncVerbs);
      }
    }

    VerbMethods.prototype.injectVerbMethods = function(path, obj) {
      var allPromises, newPromise, ref1;
      if (this._promisePlugin) {
        ref1 = this._promisePlugin.promiseCreator, newPromise = ref1.newPromise, allPromises = ref1.allPromises;
      }
      obj.url = path;
      forOwn(this._syncVerbs, (function(_this) {
        return function(verbFunc, verbName) {
          return obj[verbName] = function() {
            var args, makeRequest;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            makeRequest = function() {
              var cb, data, method, options, originalArgs, ref2;
              cb = arguments[0], originalArgs = 2 <= arguments.length ? slice.call(arguments, 1) : [];
              ref2 = verbFunc.apply(null, [path].concat(slice.call(originalArgs))), method = ref2.method, path = ref2.path, data = ref2.data, options = ref2.options;
              return _this._requester.request(method, path, data, options, cb);
            };
            return toPromise(makeRequest, newPromise).apply(null, args);
          };
        };
      })(this));
      return forOwn(this._asyncVerbs, (function(_this) {
        return function(verbFunc, verbName) {
          return obj[verbName] = function() {
            var args, makeRequest;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            makeRequest = verbFunc(_this._requester, path);
            return toPromise(makeRequest, newPromise).apply(null, args);
          };
        };
      })(this));
    };

    return VerbMethods;

  })();

}).call(this);
