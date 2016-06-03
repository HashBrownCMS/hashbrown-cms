(function() {
  var ALL_PLUGINS, HypermediaPlugin, Octokat, OctokatBase, deprecate;

  deprecate = require('./deprecate');

  OctokatBase = require('./base');

  HypermediaPlugin = require('./plugins/hypermedia');

  ALL_PLUGINS = [require('./plugins/object-chainer'), require('./plugins/promise/library-first'), require('./plugins/path-validator'), require('./plugins/authorization'), require('./plugins/preview-apis'), require('./plugins/use-post-instead-of-patch'), require('./plugins/simple-verbs'), require('./plugins/fetch-all'), require('./plugins/read-binary'), require('./plugins/pagination'), require('./plugins/cache-handler'), HypermediaPlugin, require('./plugins/camel-case')];

  Octokat = function(clientOptions) {
    var instance;
    if (clientOptions == null) {
      clientOptions = {};
    }
    if (clientOptions.plugins == null) {
      clientOptions.plugins = ALL_PLUGINS;
    }
    if (clientOptions.disableHypermedia) {
      deprecate('Please use the clientOptions.plugins array and just do not include the hypermedia plugin');
      clientOptions.plugins = clientOptions.plugins.filter(function(plugin) {
        return plugin !== HypermediaPlugin;
      });
    }
    instance = new OctokatBase(clientOptions);
    return instance;
  };

  module.exports = Octokat;

}).call(this);
