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
                branch: 'stable',
                comment: ''
            };
            
            debug.log('Checking for updates...', this);

            function checkOutput(data) {
                let behindMatches = data.match(/Your branch is behind '(.+)' by (\d+) commit/);
                let upToDateMatches = data.match(/Your branch is up-to-date with '(.+)'/);
                let messageMatches = data.match(/[a-z0-9]{40} (.+)/);

                if(behindMatches && behindMatches.length > 1) {
                    resolveObj.behind = true;
                    resolveObj.branch = behindMatches[1].replace('origin/', '');
                    resolveObj.amount = behindMatches[2];
                }
                
                if(upToDateMatches && upToDateMatches.length > 1) {
                    resolveObj.branch = upToDateMatches[1].replace('origin/', '');
                }

                if(messageMatches && messageMatches.length > 1) {
                    resolveObj.comment = messageMatches[1];
                }
            }
            
            let git = exec('git fetch && git status && git log origin -1 --format=oneline', {
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
                    if(resolveObj.behind && resolveObj.amount > 0) {
                        debug.log('Done checking for updates, but couldn\'t get last commit message', this);
                        resolve(resolveObj);
                    
                    } else {
                        debug.log('Checking for updates failed', this);
                        reject(new Error('Checking for updates failed. Please run "git fetch && git status && git log origin -1 --format=oneline" on the server to check if it runs correctly.'));
                    }
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
        })

        // Install dependencies
        .then(() => {
            return new Promise((resolve, reject) => {
                debug.log('Installing dependencies...', this);
                
                let npm = exec('npm install --production', {
                    cwd: appRoot
                });

                npm.stdout.on('data', (data) => {
                    debug.log(data, this, 3);
                });

                npm.stderr.on('data', (data) => {
                    debug.log(data, this, 3);
                });
                
                npm.on('exit', (code) => {
                    if(code == 0 || code == '0') {
                        debug.log('Install successful', this);
                        resolve();
                    } else {
                        debug.log('Update failed', this);
                        reject(new Error('npm exited with status code ' + code));
                    }
                });
            });
        });
    }
}

module.exports = UpdateHelper;
