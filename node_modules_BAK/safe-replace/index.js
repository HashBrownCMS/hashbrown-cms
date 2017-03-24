'use strict';

var PromiseA = require('bluebird').Promise;
var fs = PromiseA.promisifyAll(require('fs'));
var crypto = require('crypto');

function noop() {
}

function create(options) {

  if (!options) {
    options = {};
  }
  if (!options.tmp) {
    options.tmp = 'tmp';
  }
  if (!options.bak) {
    options.bak = 'bak';
  }
  if (options.tmp === options.bak) {
    throw new Error("'tmp' and 'bak' suffixes cannot be the same... duh");
  }

  var tmpnamefn = options.tmpnamefn || function (pathname) {
    return pathname + '.' + crypto.randomBytes(8).toString('hex') + '.' + options.tmp;
  };
  var baknamefn = options.baknamefn || function (pathname) {
    return pathname + '.' + options.bak;
  };
  /*
  var namefn = options.namefn || function (pathname) {
    return pathname;
  };
  */

  var sfs = {
    writeFileAsync: function (filename, data, options) {
      return sfs.stage(filename, data, options).then(function (tmpname) {
        //console.log(filename);
        return sfs.commit(tmpname, filename);
      });
    }
  , stageAsync: function (filename, data, options) {
      var tmpname = tmpnamefn(filename);
      //console.log(tmpname);
      return fs.writeFileAsync(tmpname, data, options).then(function () {
        return tmpname;
      });
    }
  , commitAsync: function (tmpname, filename) {
      var bakname = baknamefn(filename);
      // this may not exist
      return fs.unlinkAsync(bakname).then(noop, noop).then(function () {
        // this may not exist
        //console.log(namefn(filename), '->', bakname);
        return fs.renameAsync(filename, bakname).then(function () {
          //console.log('created bak');
        }, noop);
      }).then(function () {
        // this must be successful
        //console.log(filename, '->', filename);
        return fs.renameAsync(tmpname, filename).then(noop, function (err) {
          //console.error(err);
          return sfs.revert(filename).then(function () {
            return PromiseA.reject(err);
          });
        });
      });
    }
  , revertAsync: function (filename) {
      return new PromiseA(function (resolve, reject) {
        var bakname = baknamefn(filename);
        var tmpname = tmpnamefn(filename);

        var reader = fs.createReadStream(bakname);
        var writer = fs.createWriteStream(tmpname);

        reader.on('error', reject);
        writer.on('error', reject);

        reader.pipe(writer);
        writer.on('close', function () {
          sfs.commit(tmpname, filename).then(resolve, reject);
        });
      });
    }
  , tmpnamefn: tmpnamefn
  , baknamefn: baknamefn
  , create: create
  };
  sfs.writeFile = sfs.writeFileAsync;
  sfs.stage = sfs.stageAsync;
  sfs.commit = sfs.commitAsync;
  sfs.revert = sfs.revertAsync;

  return sfs;
}

module.exports = create();
