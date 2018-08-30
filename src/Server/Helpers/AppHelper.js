'use strict';

const ChildProcess = require('child_process');

/**
 * The main class for basic app operations
 *
 * @memberof HashBrown.Server.Helpers
 */
class AppHelper {
    /**
     * Executes a console command
     *
     * @param {String} cmd
     * @param {String} cwd
     *
     * @returns {Promise} Result
     */
    static exec(cmd, cwd = '') {
        checkParam(cmd, 'cmd', String);
        checkParam(cwd, 'cwd', String);

        if(!cwd) { cwd = appRoot; }

        return new Promise((resolve, reject) => {
            debug.log('Running command ' + cmd, this, 3);

            let process = ChildProcess.exec(cmd, { cwd: cwd });
            let result = '';

            process.stdout.on('data', (data) => {
                result += data;
                debug.log(data, this, 3);
            });

            process.stderr.on('data', (data) => {
                result += data;
                debug.log(data, this, 3);
            });

            process.on('exit', (code) => {
                if(code == 0 || code == '0') {
                    resolve(result);
                } else {
                    reject(new Error('Process "' + cmd + '" in "' + cwd + '" exited with code ' + code));
                }
            });
        });
    }
}

module.exports = AppHelper;
