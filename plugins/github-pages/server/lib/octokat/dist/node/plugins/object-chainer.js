(function() {
  var Chainer, OBJECT_MATCHER, ObjectChainer, TREE_OPTIONS, VerbMethods;

  OBJECT_MATCHER = require('../grammar/object-matcher');

  TREE_OPTIONS = require('../grammar/tree-options');

  VerbMethods = require('../verb-methods');

  Chainer = require('../chainer');

  module.exports = new (ObjectChainer = (function() {
    function ObjectChainer() {}

    ObjectChainer.prototype.chainChildren = function(chainer, url, obj) {
      var context, i, k, key, len, re, ref, results;
      results = [];
      for (key in OBJECT_MATCHER) {
        re = OBJECT_MATCHER[key];
        if (re.test(obj.url)) {
          context = TREE_OPTIONS;
          ref = key.split('.');
          for (i = 0, len = ref.length; i < len; i++) {
            k = ref[i];
            context = context[k];
          }
          results.push(chainer.chain(url, k, context, obj));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    ObjectChainer.prototype.responseMiddleware = function(arg) {
      var chainer, data, datum, i, len, plugins, requester, url, verbMethods;
      plugins = arg.plugins, requester = arg.requester, data = arg.data, url = arg.url;
      verbMethods = new VerbMethods(plugins, requester);
      chainer = new Chainer(verbMethods);
      if (url) {
        chainer.chain(url, true, {}, data);
        this.chainChildren(chainer, url, data);
      } else {
        chainer.chain('', null, {}, data);
        if (Array.isArray(data)) {
          for (i = 0, len = data.length; i < len; i++) {
            datum = data[i];
            this.chainChildren(chainer, datum.url, datum);
          }
        }
      }
      return {
        data: data
      };
    };

    return ObjectChainer;

  })());

}).call(this);
