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

try {
  Buffer.from('1337', 'hex');
} catch(e) {
  // wish I could do something here to fix the broken Buffer.from
  try {
    Buffer.from = newBuffer;
  } catch(e) {
    // but alas, I cannot
    console.warn("Your node version has buggy Buffer.from support. Please update to node >= v4.5 or >= v6.3");
  }
}
