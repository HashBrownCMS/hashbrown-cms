'use strict';

const Path = require('path');

// Set app root
global.APP_ROOT = Path.resolve(__dirname);

// Include main server module
require(Path.join(APP_ROOT, 'src', 'Server'));
