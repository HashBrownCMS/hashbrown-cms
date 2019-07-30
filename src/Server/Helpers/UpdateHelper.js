'use strict';

const ChildProcess = require('child_process');
const Path = require('path');
const FileSystem = require('fs');

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
}

module.exports = UpdateHelper;
