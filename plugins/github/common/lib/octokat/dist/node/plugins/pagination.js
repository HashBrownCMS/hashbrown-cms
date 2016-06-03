(function() {
  var Pagination;

  module.exports = new (Pagination = (function() {
    function Pagination() {}

    Pagination.prototype.responseMiddleware = function(arg) {
      var data, discard, href, i, jqXHR, len, links, part, ref, ref1, rel;
      jqXHR = arg.jqXHR, data = arg.data;
      if (!jqXHR) {
        return;
      }
      if (Array.isArray(data)) {
        data = {
          items: data.slice(0)
        };
        links = jqXHR.getResponseHeader('Link');
        ref = (links != null ? links.split(',') : void 0) || [];
        for (i = 0, len = ref.length; i < len; i++) {
          part = ref[i];
          ref1 = part.match(/<([^>]+)>;\ rel="([^"]+)"/), discard = ref1[0], href = ref1[1], rel = ref1[2];
          data[rel + "_page_url"] = href;
        }
        return {
          data: data
        };
      }
    };

    return Pagination;

  })());

}).call(this);
