'use strict';

// Lib
let glob = require('glob');
let path = require('path');
let fs = require('fs');
let rimraf = require('rimraf');

// Models
let Media = require('../models/Media');

class MediaHelper {
    /**
     * Gets all Media objects
     *
     * @return {Promise} promise
     */
    static getAllMedia() {
        return new Promise((callback) => {
            let mediaPath = this.getMediaPath() + '/*/*';
            
            glob(mediaPath, function(err, paths) {
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
        return new Promise((callback) => {
            let oldPath = file.path;
            let name = path.basename(oldPath);
            let newDir = this.getMediaPath() + '/' + id;
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
     * Gets a Media object
     *
     * @param {String} id
     *
     * @returns {Promise(Media)} media
     */
    static getMedia(id) {
        return new Promise((resolve) => {
            let mediaPath = this.getMediaPath() + '/' + id + '/*';
            
            glob(mediaPath, function(err, paths) {
                if(paths && paths.length > 0) {
                    let filePath = paths[0];
                    let media = new Media();
                    
                    media.readFromFilePath(filePath);
                    
                    resolve(media);

                } else {
                    resolve(null);

                }
            });
        });
    }

    /**
     * Gets data of a Media object
     *
     * @param {Number} id
     *
     * @return {Promise} data
     */
    static getMediaData(id) {
        return new Promise((callback) => {
            let path = this.getMediaPath() + '/' + id;
            
            fs.readdir(path, function(err, files) {
                if(err) {
                    console.log('[MediaHelper]', err);
                }

                if(files && files.length > 0) {
                    fs.readFile(path + '/' + files[0], 'binary', function(err, data) {
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
        return new Promise((callback) => {
            let path = this.getMediaPath() + '/' + id;
            
            rimraf(path, function(err) {
                if(err) {
                    throw err;
                }

                callback();
            });
        });
    }

    /**
     * Gets the media root path
     *
     * @returns {String} path
     */
    static getMediaPath() {
        let path = 
            appRoot +
            '/projects/' +
            ProjectHelper.currentProject + 
            '/storage/' +
            ProjectHelper.currentEnvironment +
            '/media/';

        return path;
    }
    
    /**
     * Gets the medie temp path
     *
     * @returns {String} path
     */
    static getTempPath() {
        let path = 
            appRoot +
            '/projects/' +
            ProjectHelper.currentProject +
            '/storage/temp';

        console.log('TEMP', path);

        return path;
    }
}

module.exports = MediaHelper;
