'use strict';

let DebugHelperCommon = require('Common/Helpers/DebugHelper');

/**
 * The helper class for debugging
 *
 * @memberof HashBrown.Server.Helpers
 */
class DebugHelper extends DebugHelperCommon {
    /**
     * Gets the debug verbosity
     *
     * @returns {Number} Verbosity
     */
    static getDebugVerbosity() {
        return process.env.DEBUG_VERBOSITY || HashBrown.Helpers.ConfigHelper.getSync('debug').verbosity || super.getDebugVerbosity();
    }
}

module.exports = DebugHelper;
