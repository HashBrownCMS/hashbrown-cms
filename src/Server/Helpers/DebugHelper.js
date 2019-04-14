'use strict';

const FileSystem = require('fs');
const Path = require('path');

const DebugHelperCommon = require('Common/Helpers/DebugHelper');

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

    /**
     * Watches the package.json file and exist the process on change
     */
    static startWatching() {
        debug.log('Watching package.json for changes', this);
        
        FileSystem.watchFile(Path.join(APP_ROOT, 'package.json'), () => {
            debug.log('package.json changed, reloading...', this);

            process.exit();
        });
    }
}

module.exports = DebugHelper;
