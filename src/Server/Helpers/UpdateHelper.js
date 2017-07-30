'use strict';

const ChildProcess = require('child_process');
const ZLib = require('zlib');
const Path = require('path');
const FileSystem = require('fs');

const RequestHelper = require('Server/Helpers/RequestHelper');


/**
 * The helper class for system updates
 *
 * @memberof HashBrown.Server.Helpers
 */
class UpdateHelper {
    /**
     * Check for updates
     *
     * @returns {Promise} Status info
     */
    static check() {
        return RequestHelper.request('get', 'https://api.github.com/repos/Putaitu/hashbrown-cms/releases/latest')
        .then((res) => {
            if(!res || !res.tag_name) {
                return Promise.reject(new Error('Couldn\'t fetch update information'));
            }

            // Compare local and remote version numbers
            let remoteVersion = res.tag_name;
            let localVersion = require(appRoot + '/package.json').version;

            return Promise.resolve({
                isBehind: this.isVersionBehind(remoteVersion, localVersion),
                remoteVersion: remoteVersion,
                localVersion: localVersion,
                comment: res.body
            });
        });
    }
   
    /**
     * Checks if version b is behind version a
     *
     * @param {String} a
     * @param {String} b
     *
     * @returns {Boolean} Whether version b is behind version a
     */
    static isVersionBehind(a, b) {
        a = a.replace('v', '');
        b = b.replace('v', '');

        let aNums = a.split('.');
        let bNums = b.split('.');

        if(aNums.length !== 3 || bNums.length !== 3) {
            throw new Error('Couldn\'t compare version numbers');
        }

        return aNums[0] > bNums[0] || aNums[1] > bNums[1] || aNums[2] > bNums[2];
    }

    /**
     * Perform update
     *
     * @returns {Promise} Status info
     */
    static update() {
        debug.log('Updating HashBrown...', this);
        
        // Get latest release info
        return RequestHelper.request('get', 'https://api.github.com/repos/Putaitu/hashbrown-cms/releases/latest')
        
        // Check versions
        .then((res) => {
            let remoteVersion = res.tag_name;
            let localVersion = require(appRoot + '/package.json').version;

            if(!this.isVersionBehind(remoteVersion, localVersion)) {
                return Promise.reject(new Error('Can\'t update, local version is not behind remote version'));
            }

            return Promise.resolve();
        })
        
        // Git checkout stable
        // NOTE: When the user is upgrading through the UI, they should be on stable
        .then(() => {
            debug.log('Checking out stable branch...', this);

            return new Promise((resolve, reject) => {
                let git = exec('git checkout stable', {
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
                        debug.log('Check done', this);
                        resolve();
                    } else {
                        debug.log('Check failed', this);
                        reject(new Error('git exited with status code ' + code));
                    }
                });
            })
        })

        // Git pull
        .then((res) => {
            debug.log('Pulling update from GitHub...', this);
            
            return new Promise((resolve, reject) => {
                let git = exec('git pull origin stable', {
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
        })

        // Install dependencies
        .then(() => {
            debug.log('Installing dependencies...', this);
            
            return new Promise((resolve, reject) => {
                let npm = ChildProcess.exec('npm install --production', {
                    cwd: appRoot
                });

                npm.stdout.on('data', (data) => {
                    debug.log(data, this, 3);
                });

                npm.stderr.on('data', (data) => {
                    debug.log(data, this, 3);
                });
                
                npm.on('exit', (code) => {
                    code = parseInt(code);

                    if(code === 0) {
                        debug.log('Install successful', this);
                        resolve();
                    } else {
                        debug.log('Install failed', this);
                        reject(new Error('npm exited with status code ' + code));
                    }
                });
            });
        });
    }
}

module.exports = UpdateHelper;
