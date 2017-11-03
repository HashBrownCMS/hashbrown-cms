'use strict';

const Processor = require('./server/Processor');

/**
 * The HashBrown Jekyll plugin
 */
class Jekyll {
    static init(app) {
        ConnectionHelper.registerProcessor('Jekyll', Processor);
    }
}

module.exports = Jekyll;
