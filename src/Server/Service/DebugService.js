'use strict';

const FileSystem = require('fs');
const Path = require('path');

/**
 * The helper class for debugging
 *
 * @memberof HashBrown.Server.Service
 */
class DebugService extends require('Common/Service/DebugService') {
    /**
     * Gets the debug verbosity
     *
     * @returns {Number} Verbosity
     */
    static getDebugVerbosity() {
        return process.env.DEBUG_VERBOSITY || HashBrown.Service.ConfigService.getSync('debug').verbosity || super.getDebugVerbosity();
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

module.exports = DebugService;
