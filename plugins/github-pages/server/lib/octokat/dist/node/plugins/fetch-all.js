(function() {
  var FetchAll, fetchNextPage, getMore, pushAll, toQueryString;

  toQueryString = require('../helpers/querystring');

  pushAll = function(target, source) {
    if (!Array.isArray(source)) {
      throw new Error('Octokat Error: Calling fetchAll on a request that does not yield an array');
    }
    return target.push.apply(target, source);
  };

  getMore = function(fetchable, requester, acc, cb) {
    var doStuff;
    doStuff = function(err, results) {
      if (err) {
        return cb(err);
      }
      pushAll(acc, results.items);
      return getMore(results, requester, acc, cb);
    };
    if (!fetchNextPage(fetchable, requester, doStuff)) {
      return cb(null, acc);
    }
  };

  fetchNextPage = function(obj, requester, cb) {
    if (typeof obj.next_page_url === 'string') {
      requester.request('GET', obj.next_page, null, null, cb);
      return true;
    } else if (obj.next_page) {
      obj.next_page.fetch(cb);
      return true;
    } else if (typeof obj.nextPageUrl === 'string') {
      requester.request('GET', obj.nextPageUrl, null, null, cb);
      return true;
    } else if (obj.nextPage) {
      obj.nextPage.fetch(cb);
      return true;
    } else {
      return false;
    }
  };

  module.exports = new (FetchAll = (function() {
    function FetchAll() {}

    FetchAll.prototype.asyncVerbs = {
      fetchAll: function(requester, path) {
        return function(cb, query) {
          return requester.request('GET', "" + path + (toQueryString(query)), null, null, function(err, results) {
            var acc;
            if (err) {
              return cb(err);
            }
            acc = [];
            pushAll(acc, results.items);
            return getMore(results, requester, acc, cb);
          });
        };
      }
    };

    return FetchAll;

  })());

}).call(this);
