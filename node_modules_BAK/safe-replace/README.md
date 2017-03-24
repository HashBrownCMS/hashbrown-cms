safe-replace
============

A micro-module for safely replacing a file.

This is intended to be generally safe even when a function that writes a file
is accidentally called twice (as may happen with node cluster).

Commandline Reference
---------------------

If I want to safely replace a file with a new version, I would do so like this:

```bash
# create the new version
touch keep.txt.RANDOM.tmp

# remove the previous backup
rm -f keep.txt.bak

# move the current version to the backup
mv keep.txt keep.txt.bak

# move the new version to the current
mv keep.txt.RANDOM.tmp keep.txt
```

If `keep.txt` became corrupt and I wanted to use the backup,
I would do this:

```bash
# copy the backup to the new version
rsync keep.txt.bak keep.txt
```

In Node
-------

I ported that proccess to node.

```
sfs.writeFileAsync
sfs.stageAsync
sfs.commitAsync
sfs.revertAsync
```

```js
// default behavior is to concat (filename + '.' + rnd() + '.tmp')
var safeReplace = require('safe-replace').create({ tmp: 'tmp', bak: 'bak' });

var data = new Buffer('A priceless document');
safeReplace.writeFileAsync('keep.txt', data, 'ascii').then(function () {
  fs.readdir('.', function (nodes) {
    console.log('file system nodes', nodes);
    // keep.txt
    // keep.txt.bak
  });
});

// let's say I want to write a tmp file and not commit it... weird
safeReplace.stageAsync('keep.txt', data, 'ascii').then(function (tmpname) {
  fs.readdir('.', function (nodes) {
    console.log('file system nodes', nodes);
    // keep.txt.ac71teh8mja.tmp
  });
});

// let's say I wrote keep.txt.x7t7sq926.tmp with my own mechanism
safeReplace.commitAsync('keep.txt.x7t7sq926.tmp', 'keep.txt').then(function () {
  fs.readdir('.', function (nodes) {
    console.log('file system nodes', nodes);
    // keep.txt
    // keep.txt.bak
  });
});

// let's say I want to revert the file from the '.bak'
safeReplace.revertAsync('keep.txt').then(function () {
  fs.readdir('.', function (nodes) {
    console.log('file system nodes', nodes);
    // keep.txt
    // keep.txt.bak
  });
});
```
