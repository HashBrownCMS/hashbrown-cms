'use strict';

// Libs
const ChildProcess = require('child_process');
const ZLib = require('zlib');
const Path = require('path');
const FileSystem = require('fs');

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
        
        // Download zip
        .then((res) => {
            let remoteVersion = res.tag_name;
            let localVersion = require(appRoot + '/package.json').version;

            if(!this.isVersionBehind(remoteVersion, localVersion)) {
                return Promise.reject(new Error('Can\'t update, local version is not behind remote version'));
            }

            let url = 'https://github.com/Putaitu/hashbrown-cms/archive/' + remoteVersion + '.zip';

            debug.log('Downloading update from ' + url + '...', this);
            
            return RequestHelper.download(url, appRoot + '/storage/update.zip');
        })

        // Unpack zip
        .then(() => {
            debug.log('Unpacking update...', this);

            return new Promise((resolve, reject) => {
                let stream = FileSystem.createReadStream(appRoot + '/storage/update.zip');

                stream.pipe(ZLib.unzip());

                stream.on('error', (e) => {
                    reject(e);
                });

                stream.on('entry', (entry) => {
                    let dirPath = appRoot + '/storage/update';
                    let fullPath = Path.join(dirPath, entry.path);

                    // Create the unpacking directory
                    FileSystem.mkDirSync(dirPath);

                    entry.pipe(FileSystem.createWriteStream(fullPath));
                });
            });
        })

        // Install dependencies
        .then(() => {
            return new Promise((resolve, reject) => {
                debug.log('Installing dependencies...', this);
                
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
