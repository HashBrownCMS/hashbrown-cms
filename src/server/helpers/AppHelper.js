'use strict';

// Libs
let exec = require('child_process').exec;

/**
 * The main class for basic app operations
 */
class AppHelper {
    /**
     * Restarts the app
     *
     * @param {Number} timeout
     */
    static restart(timeout) {
        setTimeout(() => {
            let pm2 = exec('pm2 restart hashbrown', {
                cwd: appRoot
            });

            pm2.stdout.on('data', (data) => {
                debug.log(data, this);
            });

            pm2.stderr.on('data', (data) => {
                debug.log(data, this);
            });
            
            pm2.on('exit', (code) => {
                debug.error(new Error('pm2 exited with status code ' + code), this);
            });
        }, (timeout || 0) * 1000);
    }
}

module.exports = AppHelper;
