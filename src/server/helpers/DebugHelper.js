'use strict';

let DebugHelperCommon = require(appRoot + '/src/common/helpers/DebugHelper');

class DebugHelper extends DebugHelperCommon {
    /**
     * Event: Log
     *
     * @param {String} senderString
     * @param {String} dateString
     * @param {String} message
     */
    static onLog(senderString, dateString, message) {
        LogHelper.writeLine(senderString + ' ' + dateString + ' ' + message); 
    }
}

module.exports = DebugHelper;
