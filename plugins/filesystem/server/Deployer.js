'use strict';

const FileSystem = require('fs');
const Path = require('path');
const Glob = require('glob');
const RimRaf = require('rimraf');

/**
 * FileSystem deployer
 */
class FileSystemDeployer extends HashBrown.Models.Deployer {
    // Name and alias
    static get name() { return 'FileSystem'; }
    static get alias() { return 'filesystem'; }

    /**
     * Gets the root path
     *
     * @returns {String} Root
     */
    getRootPath() {
        return this.rootPath;
    }

    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(String, 'rootPath');
    }

    /**
     * Tests this deployer
     *
     * @returns {Promise} Result
     */
    test() {
        return HashBrown.Helpers.RequestHelper.request('get', 'https://api.github.com/user?token=' + this.token)
        .then(() => {
            return Promise.resolve(true);  
        });
    }

    /**
     * Gets a file
     *
     * @param {String} path
     *
     * @return {Promise} Promise
     */
    getFile(path) {
        return new Promise((resolve, reject) => {
            FileSystem.readFile(path, (err, data) => {
                if(err) {
                    reject(err);
                
                } else {
                    resolve({
                        name: Path.basename(path),
                        path: path,
                        data: data.toString('utf8')
                    });
                }
            });
        });
    }
    
    /**
     * Gets a folder
     *
     * @param {String} path
     * @param {Number} recursions
     *
     * @returns {Promise} Result
     */
    getFolder(path, recursions) {
        if(recursions > 0) {
            path += '*/';

            let subdirs = [];

            for(let i = 0; i < recursions || 0; i++) {
                subdirs.push('*');
            }

            path += subdirs.join('/');
        }

        return new Promise((resolve, reject) => {
            Glob(path, (err, data) => {
                if(err) {
                    reject(err);
                
                } else {
                    resolve(data);

                }
            });
        });
    }
    
    /**
     * Set file
     *
     * @param {String} path
     * @param {String} base64
     *
     * @return {Promise} Promise
     */
    setFile(path, base64) {
        return new Promise((resolve, reject) => {
            let dirPath = path.slice(0, path.lastIndexOf('/'));

            HashBrown.Helpers.MediaHelper.mkdirRecursively(this.getLocalUrl() + dirPath);

            debug.log('Writing file "' + this.getLocalUrl() + path + '"...', this);

            FileSystem.writeFile(path, Buffer.from(base64, 'base64'), (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve();
                    debug.log('Uploaded file successfully to ' + path, this);
                }
            });
        });
    }
   
    /**
     * Removes a file
     *
     * @param {String} path
     *
     * @return {Promise} Promise
     */
    removeFile(path) {
        return new Promise((resolve, reject) => {
            RimRaf(path, (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Removes a folder
     *
     * @param {String} path
     *
     * @returns {Promise} Result
     */
    removeFolder(path) {
        return this.removeFile(path);
    }
}

module.exports = FileSystemDeployer;
