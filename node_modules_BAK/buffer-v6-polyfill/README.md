# node-buffer-v6-shim

A shim for older versions of node &lt; v6 for methods such as `allow()`, `from()`, etc

Usage
-----

```
'use strict';

require('buffer-v6-polyfill');

// all your codez ...
```

Show me the Code
----------------

```javascript
'use strict';

if (Number(process.version.match(/^v(\d+\.\d+)/)[1]) >= 6.0) {
  return;
}

function newBuffer(data, encoding, len) {
  return new Buffer(data, encoding, len);
}

function newSlowBuffer(data, encoding, len) {
  var SlowBuffer = require('buffer').SlowBuffer;
  return new SlowBuffer(data, encoding, len);
}

if (!Buffer.alloc) {
  Buffer.alloc = newBuffer;
}
if (!Buffer.allocUnsafe) {
  Buffer.allocUnsafe = newBuffer;
}
if (!Buffer.allocUnsafeSlow) {
  Buffer.allocUnsafeSlow = newSlowBuffer;
}
if (!Buffer.from) {
  Buffer.from = newBuffer;
}
```
