'use strict';

var safeReplace = require('./'); //.create();
//var safeReplace = require('safe-replace').create();
var fs = require('fs');

safeReplace.writeFile('keep.txt', 'my precious').then(function () {
  fs.readdir('.', function (err, nodes) {
    console.log('file system nodes', nodes);
  });
});
