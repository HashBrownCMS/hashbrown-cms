'use strict';

let DebugHelperCommon = require('Common/Helpers/DebugHelper');

/**
 * The helper class for debugging
 *
 * @memberof HashBrown.Server.Helpers
 */
class DebugHelper extends DebugHelperCommon {
    /**
     * Event: Log
     *
     * @param {String} senderString
     * @param {String} dateString
     * @param {String} message
     */
    static onLog(senderString, dateString, message) {
        // TODO (Issue #159): Write to log
    }
}

module.exports = DebugHelper;
