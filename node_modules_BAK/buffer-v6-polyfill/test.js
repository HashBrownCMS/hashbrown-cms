'use strict';

require('buffer-v6-polyfill');

if (!Buffer.alloc) {
  throw new Error("Well, actually... buffer-v6-polyfill sucks at being a polyfill!!");
}
