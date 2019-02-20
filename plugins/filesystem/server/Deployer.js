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
    static get name() { return 'File system'; }
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
        return Promise.resolve(true);  
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
     * @param {Number} levels
     *
     * @returns {Promise} Result
     */
    getFolder(path, levels = 1) {
        if(levels < 1) { levels = 1; }

        for(let i = 0; i < levels; i++) {
            path = Path.join(path, '*');
        }

        return new Promise((resolve, reject) => {
            Glob(path, (err, data) => {
                if(err) { return reject(err); }
                
                resolve(data);
            });
        });
    }
    
    /**
     * Rename file
     *
     * @param {String} oldPath
     * @param {String} name
     *
     * @return {Promise} Promise
     */
    renameFile(oldPath, name) {
        let newPath = Path.join(Path.dirname(oldPath), name);
        
        return new Promise((resolve, reject) => {
            FileSystem.rename(oldPath, newPath, (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve();
                    debug.log('Renamed file successfully to ' + newPath, this);
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
            let dirPath = Path.dirname(path);

            HashBrown.Helpers.MediaHelper.mkdirRecursively(dirPath);

            debug.log('Writing file "' + path + '"...', this);

            let fileData = Buffer.from(base64, 'base64');

            FileSystem.writeFile(path, fileData, (err) => {
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
