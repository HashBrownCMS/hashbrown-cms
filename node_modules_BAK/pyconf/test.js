'use strict';
//var pyconf = require('pyconf');
var pyconf = require('./');

pyconf.readFile('doesnt-exist.conf', function (err, obj) {
  if (!err || obj) {
    console.error("didn't get an error (or also got an object) when testing on non-existant file");
    process.exit(1);
  }
});
pyconf.readFile('example.conf', function (err, obj) {
  if (err) {
    console.error(err.stack);
    return;
  }

  pyconf.writeFile('example.conf.new', obj, function (err) {
    if (err) {
      console.error(err.stack);
      return;
    }

    console.log("Run this command to check that the outputs are the same:");
    console.log("  diff example.conf example.conf.new");
  });
});
