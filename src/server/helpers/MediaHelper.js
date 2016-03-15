'use strict';

// Lib
let glob = require('glob');
let path = require('path');
let fs = require('fs');

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
            glob(appRoot + '/storage/media/*', function(err, paths) {
                let list = [];
                
                for(let i in paths) {
                    let filename = path.basename(paths[i]);
                    let id = filename.substring(0, filename.indexOf('_'));
                    let name = filename.substring(filename.indexOf('_') + 1);
                    
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
            let newPath = appRoot + '/storage/media/' + id + '_' + name;

            console.log('[MediaHelper] Setting media data at "' + newPath + '" for id "' + id + '"...');

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
            MediaHelper.getMediaPath(id)
            .then(function(path) {
                if(path) {
                    fs.readFile(appRoot + path, 'binary', function(err, data) {
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
     * Gets path of a Media object
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static getMediaPath(id) {
        return new Promise(function(callback) {
            glob(appRoot + '/storage/media/**/' + id + '_*', function(err, paths) {
                if(paths && paths.length > 0) {
                    if(paths.length == 1) {
                        let path = paths[0].replace(appRoot, '') || '';
                    
                        callback(path);
                    } else {
                        throw 'More than one media object matches id "' + id + '"';

                    }
                
                } else {
                    throw 'No media found by id "' + id + '"';
                
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
            MediaHelper.getMediaPath(id)
            .then(function(path) {
                fs.unlink(appRoot + path, function(err) {
                    if(err) {
                        throw err;
                    }

                    callback();
                });
            }); 
        });
    }
}

module.exports = MediaHelper;
