# node-config-python

Read and write python config files non-destructively (preserves comments and line-order)

Turns this kind of thing:

```python
foo = True
bar = None
baz = whatever
qux = apples,bananas
```

Into this kind of thing:

```javascript
{ foo: true
, bar: null
, baz: "whatever"
, qux: ["apples", "bananas"]
}
```

(comments are stored in meta-data keys `__lines` and `__keys`)

## Install

```bash
npm install --save pyconf
```

## Usage

```javascript
var pyconf = require('pyconf');

// alias for fs.readFile() then pyconf.parse()
pyconf.readFile("/path/to/foo.conf", function (err, obj) {
  console.log(obj);
});

// alias for pyconf.stringify() then safeReplace.writeFile()
pyconf.writeFile("/path/to/foo.conf", obj, function (err, obj) {
  console.log("wrote file");
});
```

Note: the `writeFile` function uses `safe-replace` so that it will work even in environments where race conditions are possible and will also create a backup file `whatever.conf.bak` of the config being overwritten.

## API

```javascript
pyconf
  .parse(str, cb)                   // => err, object
  
  .stringify(obj, cb)               // => err, text
  
  .readFile(filename, cb)           // => err, object
  
  .writeFile(filename, obj, cb)     // => err 
```
