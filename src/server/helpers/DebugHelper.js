'use strict';

let DebugHelperCommon = require(appRoot + '/src/common/Helpers/DebugHelper');

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
