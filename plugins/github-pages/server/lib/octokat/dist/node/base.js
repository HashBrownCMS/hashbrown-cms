(function() {
  var Chainer, NativePromiseOnlyPlugin, OctokatBase, Requester, SimpleVerbsPlugin, TREE_OPTIONS, VerbMethods, applyHypermedia, deprecate, plus, uncamelizeObj,
    slice = [].slice;

  plus = require('./plus');

  deprecate = require('./deprecate');

  TREE_OPTIONS = require('./grammar/tree-options');

  Chainer = require('./chainer');

  VerbMethods = require('./verb-methods');

  SimpleVerbsPlugin = require('./plugins/simple-verbs');

  NativePromiseOnlyPlugin = require('./plugins/promise/native-only');

  Requester = require('./requester');

  applyHypermedia = require('./helpers/hypermedia');

  uncamelizeObj = function(obj) {
    var i, j, key, len, o, ref, value;
    if (Array.isArray(obj)) {
      return (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = obj.length; j < len; j++) {
          i = obj[j];
          results.push(uncamelizeObj(i));
        }
        return results;
      })();
    } else if (obj === Object(obj)) {
      o = {};
      ref = Object.keys(obj);
      for (j = 0, len = ref.length; j < len; j++) {
        key = ref[j];
        value = obj[key];
        o[plus.uncamelize(key)] = uncamelizeObj(value);
      }
      return o;
    } else {
      return obj;
    }
  };

  OctokatBase = function(clientOptions) {
    var disableHypermedia, instance, plugins, request, verbMethods;
    if (clientOptions == null) {
      clientOptions = {};
    }
    plugins = clientOptions.plugins || [SimpleVerbsPlugin, NativePromiseOnlyPlugin];
    disableHypermedia = clientOptions.disableHypermedia;
    if (disableHypermedia == null) {
      disableHypermedia = false;
    }
    instance = {};
    request = function(method, path, data, options, cb) {
      var ref, requester;
      if (options == null) {
        options = {
          raw: false,
          isBase64: false,
          isBoolean: false
        };
      }
      if (data && !(typeof global !== "undefined" && global !== null ? (ref = global['Buffer']) != null ? ref.isBuffer(data) : void 0 : void 0)) {
        data = uncamelizeObj(data);
      }
      requester = new Requester(instance, clientOptions, plugins);
      return requester.request(method, path, data, options, function(err, val) {
        var context, obj;
        if (err) {
          return cb(err);
        }
        if (options.raw) {
          return cb(null, val);
        }
        if (!disableHypermedia) {
          context = {
            data: val,
            plugins: plugins,
            requester: requester,
            instance: instance,
            clientOptions: clientOptions
          };
          obj = instance._parseWithContext(path, context);
          return cb(null, obj);
        } else {
          return cb(null, val);
        }
      });
    };
    verbMethods = new VerbMethods(plugins, {
      request: request
    });
    (new Chainer(verbMethods)).chain('', null, TREE_OPTIONS, instance);
    instance.me = instance.user;
    instance.parse = function(data) {
      var context;
      context = {
        requester: {
          request: request
        },
        plugins: plugins,
        data: data,
        instance: instance,
        clientOptions: clientOptions
      };
      return instance._parseWithContext('', context);
    };
    instance._parseWithContext = function(path, context) {
      var data, j, len, plugin, requester, url;
      data = context.data, requester = context.requester;
      url = data.url || path;
      plus.extend(context, {
        url: url
      });
      for (j = 0, len = plugins.length; j < len; j++) {
        plugin = plugins[j];
        if (plugin.responseMiddleware) {
          plus.extend(context, plugin.responseMiddleware(context));
        }
      }
      data = context.data;
      return data;
    };
    instance._fromUrlWithDefault = function() {
      var args, defaultFn, path;
      path = arguments[0], defaultFn = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
      path = applyHypermedia.apply(null, [path].concat(slice.call(args)));
      verbMethods.injectVerbMethods(path, defaultFn);
      return defaultFn;
    };
    instance.fromUrl = function() {
      var args, defaultFn, path;
      path = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      defaultFn = function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        deprecate('call ....fetch() explicitly instead of ...()');
        return defaultFn.fetch.apply(defaultFn, args);
      };
      return instance._fromUrlWithDefault.apply(instance, [path, defaultFn].concat(slice.call(args)));
    };
    instance._fromUrlCurried = function(path, defaultFn) {
      var fn;
      fn = function() {
        var templateArgs;
        templateArgs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        if (defaultFn && templateArgs.length === 0) {
          return defaultFn.apply(fn);
        } else {
          return instance.fromUrl.apply(instance, [path].concat(slice.call(templateArgs)));
        }
      };
      if (!/\{/.test(path)) {
        verbMethods.injectVerbMethods(path, fn);
      }
      return fn;
    };
    instance.status = instance.fromUrl('https://status.github.com/api/status.json');
    instance.status.api = instance.fromUrl('https://status.github.com/api.json');
    instance.status.lastMessage = instance.fromUrl('https://status.github.com/api/last-message.json');
    instance.status.messages = instance.fromUrl('https://status.github.com/api/messages.json');
    return instance;
  };

  module.exports = OctokatBase;

}).call(this);
