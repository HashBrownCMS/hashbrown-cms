'use strict';

// Lib
let glob = require('glob');
let path = require('path');
let fs = require('fs');
let rimraf = require('rimraf');

// Promise
let Promise = require('bluebird');

class MediaHelper {
    /**
     * Gets all Media objects
     *
     * @return {Promise} promise
     */
    static getAllMedia() {
        return new Promise(function(callback) {
            glob(appRoot + '/storage/media/*/*', function(err, paths) {
                let list = [];
                
                for(let i in paths) {
                    let name = path.basename(paths[i]);
                    let id = paths[i];
                    
                    id = id.replace('/' + name, '');
                    id = id.substring(id.lastIndexOf('/') + 1);

                    // Remove file extension
                    name = name.replace(/\.[^/.]+$/, '');

                    list[list.length] = {
                        id: id,
                        name: name
                    };
                }
                                       
                callback(list);
            });
        });
    }

    /**
     * Sets a Media object
     *
     * @param {Number} id
     * @param {Object} file
     *
     * @return {Promise} promise
     */
    static setMediaData(id, file) {
        return new Promise(function(callback) {
            let oldPath = file.path;
            let name = path.basename(oldPath);
            let newDir = appRoot + '/storage/media/' + id;
            let newPath = newDir + '/' + name;

            console.log('[MediaHelper] Setting media data at "' + newPath + '" for id "' + id + '"...');

            if(!fs.existsSync(newDir)){
                fs.mkdirSync(newDir);
            } else {
                // TODO: Remove old content

            }

            fs.rename(oldPath, newPath, function() {
                callback();
            });
        });
    }

    /**
     * Gets data of a Media object
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static getMediaData(id) {
        return new Promise(function(callback) {
            fs.readdir(appRoot + '/storage/media/' + id, function(err, files) {
                if(err) {
                    throw err;
                }

                if(files.length > 0) {
                    fs.readFile(appRoot + '/storage/media/' + '/' + id + '/' + files[0], 'binary', function(err, data) {
                        if(err) {
                            throw err;
                        }

                        callback(data);
                    });
                } else {
                    callback(null);
                
                }
            });
        });
    }

    /**
     * Removes a Media object
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static removeMedia(id) {
        return new Promise(function(callback) {
            rimraf(appRoot + '/storage/media/' + id, function(err) {
                if(err) {
                    throw err;
                }

                callback();
            });
        });
    }
}

module.exports = MediaHelper;
