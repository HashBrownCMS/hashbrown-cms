'use strict';

// Libs
let spawn = require('child_process').spawn;
let exec = require('child_process').exec;

/**
 * The helper class for system updates
 */
class UpdateHelper {
    /**
     * Check for updates
     *
     * @returns {Promise} Status info
     */
    static check() {
        return new Promise((resolve, reject) => {
            let resolveObj = {
                behind: false,
                amount: 0,
                branch: 'origin/master'
            };
            
            debug.log('Checking for updates...', this);

            function checkOutput(data) {
                let behindMatches = data.match(/Your branch is behind '(.+)' by (\d) commit/);
                let upToDateMatches = data.match(/Your branch is up-to-date with '(.+)'/);

                if(behindMatches && behindMatches.length > 1) {
                    resolveObj.behind = true;
                    resolveObj.branch = behindMatches[1];
                    resolveObj.amount = behindMatches[2];
                }
                
                if(upToDateMatches && upToDateMatches.length > 1) {
                    resolveObj.branch = upToDateMatches[1];
                }
            }
            
            let git = exec('git fetch && git status', {
                cwd: appRoot
            });

            git.stdout.on('data', (data) => {
                checkOutput(data);
                debug.log(data, this, 3);
            });

            git.stderr.on('data', (data) => {
                checkOutput(data);
                debug.log(data, this, 3);
            });
            
            git.on('exit', (code) => {
                if(code == 0 || code == '0') {
                    debug.log('Done checking for updates', this);
                    resolve(resolveObj);
                } else {
                    debug.log('Checking for updates failed', this);
                    reject(new Error('git exited with status code ' + code));
                }
            });
        });
    }
    
    /**
     * Perform update
     *
     * @returns {Promise} Status info
     */
    static update() {
        return new Promise((resolve, reject) => {
            debug.log('Updating HashBrown...', this);
            
            let git = exec('git pull', {
                cwd: appRoot
            });

            git.stdout.on('data', (data) => {
                debug.log(data, this, 3);
            });

            git.stderr.on('data', (data) => {
                debug.log(data, this, 3);
            });
            
            git.on('exit', (code) => {
                if(code == 0 || code == '0') {
                    debug.log('Update successful', this);
                    resolve();
                } else {
                    debug.log('Update failed', this);
                    reject(new Error('git exited with status code ' + code));
                }
            });
        });
    }
}

module.exports = UpdateHelper;
