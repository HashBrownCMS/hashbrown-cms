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
            glob(appRoot + '/public/media/*', function(err, paths) {
                let list = [];
                
                for(let i in paths) {
                    let id = path.basename(paths[i]);
                
                    list[list.length] = {
                        id: id
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
            let newPath = appRoot + '/storage/media/' + name;
            let linkPath = appRoot + '/public/media/' + id;

            console.log('[MediaHelper] Setting media data at "' + newPath + '" for id "' + id + '"...');

            fs.rename(oldPath, newPath, function() {
                fs.symlink(newPath, linkPath, function() {
                    callback();
                });
            });
        });
    }
}

module.exports = MediaHelper;
