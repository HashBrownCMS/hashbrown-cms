'use strict';

const Processor = require('./server/Processor');

/**
 * The HashBrown Jekyll plugin
 */
class Jekyll {
    static init(app) {
        HashBrown.Helpers.ConnectionHelper.registerProcessor(Processor);
    }
}

module.exports = Jekyll;
