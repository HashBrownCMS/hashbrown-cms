'use strict';

let DebugHelperCommon = require('Common/Helpers/DebugHelper');

let logHandlers = {};

/**
 * The helper class for debugging
 *
 * @memberof HashBrown.Server.Helpers
 */
class DebugHelper extends DebugHelperCommon {
    /**
     * Event: Log
     *
     * @param {String} dateString
     * @param {String} senderString
     * @param {String} message
     * @param {String} type
     */
    static onLog(dateString, senderString, message, type) {
        // TODO (Issue #159): Write to log
      
        for(let name in logHandlers) {
            logHandlers[name](dateString, senderString, message, type);
        }

        super.onLog(dateString, senderString, message, type);
    }

    /**
     * Gets the debug verbosity
     *
     * @returns {Number} Verbosity
     */
    static getDebugVerbosity() {
        return process.env.DEBUG_VERBOSITY || HashBrown.Helpers.ConfigHelper.getSync('debug').verbosity || super.getDebugVerbosity();
    }

    /**
     * Sets a handler to log output
     *
     * @param {String} name
     * @param {Function} handler
     */
    static setLogHandler(name, handler) {
        logHandlers[name] = handler;
    }
}

module.exports = DebugHelper;
