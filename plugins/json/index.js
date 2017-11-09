'use strict';

const Processor = require('./server/Processor');

/**
 * The HashBrown Json plugin
 */
class Json {
    static init(app) {
        HashBrown.Helpers.ConnectionHelper.registerProcessor(Processor);
    }
}

module.exports = Json;
