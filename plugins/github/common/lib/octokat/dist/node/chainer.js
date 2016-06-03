(function() {
  var Chainer, plus,
    slice = [].slice;

  plus = require('./plus');

  module.exports = Chainer = (function() {
    function Chainer(_verbMethods) {
      this._verbMethods = _verbMethods;
    }

    Chainer.prototype.chain = function(path, name, contextTree, fn) {
      var fn1;
      if (fn == null) {
        fn = (function(_this) {
          return function() {
            var args, separator;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            if (!args.length) {
              throw new Error('BUG! must be called with at least one argument');
            }
            if (name === 'compare') {
              separator = '...';
            } else {
              separator = '/';
            }
            return _this.chain(path + "/" + (args.join(separator)), name, contextTree);
          };
        })(this);
      }
      this._verbMethods.injectVerbMethods(path, fn);
      if (typeof fn === 'function' || typeof fn === 'object') {
        fn1 = (function(_this) {
          return function(name) {
            delete fn[plus.camelize(name)];
            return Object.defineProperty(fn, plus.camelize(name), {
              configurable: true,
              enumerable: true,
              get: function() {
                return _this.chain(path + "/" + name, name, contextTree[name]);
              }
            });
          };
        })(this);
        for (name in contextTree || {}) {
          fn1(name);
        }
      }
      return fn;
    };

    return Chainer;

  })();

  module.exports = Chainer;

}).call(this);
