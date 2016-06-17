(function() {
  var SimpleVerbs, toQueryString,
    slice = [].slice;

  toQueryString = require('../helpers/querystring');

  module.exports = new (SimpleVerbs = (function() {
    function SimpleVerbs() {}

    SimpleVerbs.prototype.verbs = {
      fetch: function(path, query) {
        return {
          method: 'GET',
          path: "" + path + (toQueryString(query))
        };
      },
      read: function(path, query) {
        return {
          method: 'GET',
          path: "" + path + (toQueryString(query)),
          options: {
            isRaw: true
          }
        };
      },
      remove: function(path, data) {
        return {
          method: 'DELETE',
          path: path,
          data: data,
          options: {
            isBoolean: true
          }
        };
      },
      create: function(path, data, contentType) {
        if (contentType) {
          return {
            method: 'POST',
            path: path,
            data: data,
            options: {
              isRaw: true,
              contentType: contentType
            }
          };
        } else {
          return {
            method: 'POST',
            path: path,
            data: data
          };
        }
      },
      update: function(path, data) {
        return {
          method: 'PATCH',
          path: path,
          data: data
        };
      },
      add: function(path, data) {
        return {
          method: 'PUT',
          path: path,
          data: data,
          options: {
            isBoolean: true
          }
        };
      },
      contains: function() {
        var args, path;
        path = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        return {
          method: 'GET',
          path: path + "/" + (args.join('/')),
          options: {
            isBoolean: true
          }
        };
      }
    };

    return SimpleVerbs;

  })());

}).call(this);
