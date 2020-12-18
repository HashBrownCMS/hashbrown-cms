'use strict';

const Path = require('path');

// Set app root
global.APP_ROOT = Path.resolve(__dirname);
global.APP_STARTED = Date.now();

// Include main server module
require(Path.join(APP_ROOT, 'src', 'Server'));
