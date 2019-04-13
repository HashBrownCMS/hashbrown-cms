'use strict';

const ChildProcess = require('child_process');
const Path = require('path');
const FileSystem = require('fs');

// TODO: Make this a GIT submodule
const SemanticVersion = require('semver');

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
        return HashBrown.Helpers.RequestHelper.request('get', 'https://api.github.com/repos/HashBrownCMS/hashbrown-cms/releases/latest')
        .then((res) => {
            if(!res || !res.tag_name) {
                return Promise.reject(new Error('Couldn\'t fetch update information'));
            }

            // Compare local and remote version numbers
            let remoteVersion = res.tag_name;
            let localVersion = require(APP_ROOT + '/package.json').version;

            return Promise.resolve({
                isBehind: this.isVersionBehind(localVersion, remoteVersion),
                remoteVersion: remoteVersion,
                localVersion: localVersion,
                comment: res.body
            });
        });
    }
   
    /**
     * Checks if version a is behind version b
     *
     * @param {String} a
     * @param {String} b
     *
     * @returns {Boolean} Whether version a is behind version b
     */
    static isVersionBehind(a, b) {
        a = a.replace('v', '');
        b = b.replace('v', '');

        if(!SemanticVersion.valid(a) || !SemanticVersion.valid(b)) {
            throw new Error('Couldn\'t compare version numbers');
        }

        return SemanticVersion.lt(a, b);
    }

    /**
     * Perform update
     *
     * @returns {Promise} Status info
     */
    static update() {
        debug.log('Updating HashBrown...', this);
        
        // Get latest release info
        return HashBrown.Helpers.RequestHelper.request('get', 'https://api.github.com/repos/HashBrownCMS/hashbrown-cms/releases/latest')
        
        // Check versions
        .then((res) => {
            let remoteVersion = res.tag_name;
            let localVersion = require(APP_ROOT + '/package.json').version;

            if(!this.isVersionBehind(localVersion, remoteVersion)) {
                return Promise.reject(new Error('Can\'t update, local version is not behind remote version'));
            }

            return Promise.resolve();
        })
        
        // Git checkout stable
        // NOTE: When the user is upgrading through the UI, they should be on stable
        .then(() => {
            debug.log('Checking out stable branch...', this);

            return new Promise((resolve, reject) => {
                let git = ChildProcess.exec('git checkout stable', {
                    cwd: APP_ROOT
                });

                git.stdout.on('data', (data) => {
                    debug.log(data, this, 3);
                });

                git.stderr.on('data', (data) => {
                    debug.log(data, this, 3);
                });

                git.on('exit', (code) => {
                    if(code == 0 || code == '0') {
                        resolve();
                    } else {
                        reject(new Error('Failed to upgrade automatically. Please refer to the <a href="/readme">readme</a> for manual upgrade instructions.'));
                    }
                });
            })
        })

        // Git pull
        .then((res) => {
            debug.log('Pulling update from GitHub...', this);
            
            return new Promise((resolve, reject) => {
                let git = ChildProcess.exec('git pull origin stable', {
                    cwd: APP_ROOT
                });

                git.stdout.on('data', (data) => {
                    debug.log(data, this, 3);
                });

                git.stderr.on('data', (data) => {
                    debug.log(data, this, 3);
                });

                git.on('exit', (code) => {
                    if(code == 0 || code == '0') {
                        resolve();
                    } else {
                        reject(new Error('Update failed while trying to run "git pull"'));
                    }
                });
            })
        })

        // Install submodules
        .then(() => {
            debug.log('Installing submodules...', this);
            
            return new Promise((resolve, reject) => {
                let npm = ChildProcess.exec('git submodule update --recursive --init', {
                    cwd: APP_ROOT
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
                        resolve();
                    } else {
                        reject(new Error('Install failed while trying to run "git submodule update"'));
                    }
                });
            });
        })

        // Install node dependencies
        .then(() => {
            debug.log('Installing dependencies...', this);
            
            return new Promise((resolve, reject) => {
                let npm = ChildProcess.exec('rm -rf node_modules && npm install --production', {
                    cwd: APP_ROOT
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
                        resolve();
                    } else {
                        reject(new Error('Install failed while trying to run "npm install"'));
                    }
                });
            });
        });
    }
}

module.exports = UpdateHelper;
