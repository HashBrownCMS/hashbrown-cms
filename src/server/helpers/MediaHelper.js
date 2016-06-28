'use strict';

// Lib
let glob = require('glob');
let path = require('path');
let fs = require('fs');
let rimraf = require('rimraf');
let multer = require('multer');

// Models
let Media = require('../models/Media');

class MediaHelper {
    /**
     * Gets the upload handler
     *
     * @return {Function} handler
     */
    static getUploadHandler(mode) {
        let handler = multer({
            storage: multer.diskStorage({
                destination: (req, file, resolve) => {
                    let path = MediaHelper.getTempPath();
                   
                    debug.log('Handling file upload...', this);

                    if(!fs.existsSync(path)){
                        this.mkdirRecursively(path, () => {
                            resolve(null, path);
                        });
                    
                    } else {
                        resolve(null, path);

                    }
                },
                filename: (req, file, cb) => {
                    let split = file.originalname.split('.');
                    let name = split[0];
                    let extension = split[1];

                    name = name.replace(/\W+/g, '-').toLowerCase();
                   
                    if(extension) {
                        name += '.' + extension;
                    }

                    cb(null, name);
                }
            })
        })
        
        if(mode == 'array') {
            return handler.array('media', 100);
        } else {
            return handler.single('media');
        }
    }

    /**
     * Makes a directory recursively
     *
     * @param {String} dirPath
     * @param {Function} callback
     */
    static mkdirRecursively(dirPath, callback) {
        return new Promise((resolve, reject) => {
            let parents = dirPath.split('/');
            let finalPath = '/';

            for(let i in parents) {
                finalPath += parents[i];

                if(!fs.existsSync(finalPath)) {
                    console.log('Creating parent ' + finalPath);
                    fs.mkdirSync(finalPath);
                }

                if(i < parents.length - 1) {
                    finalPath += '/';
                }
            }
            
            callback();
        });
    }

    /**
     * Gets all Media objects
     *
     * @return {Promise} promise
     */
    static getAllMedia() {
        return new Promise((callback) => {
            let mediaPath = this.getMediaPath() + '*/*';
            
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
        return new Promise((resolve, reject) => {
            let oldPath = file.path;
            let name = path.basename(oldPath);
            let newDir = this.getMediaPath() + id;
            let newPath = newDir + '/' + name;

            debug.log('Setting media data at "' + newPath + '"...', this);

            // First check if the given directory exists
            // If it doesn't, create it with parents recursively
            if(!fs.existsSync(newDir)){
                this.mkdirRecursively(newDir, (err) => {
                    if(err) {
                        reject(new Error(err));
                    
                    } else {
                        // Move the temp file to the new path
                        fs.rename(oldPath, newPath, function(err) {
                            if(err) {
                                reject(new Error(err));
                            
                            } else {
                                resolve();

                            }
                        });
                    
                    }
                });

            // If it does exist, remove the directory
            } else {
                rimraf(newDir, function(err) {
                    if(err) {
                        reject(new Error(err));
                    
                    } else {
                        // Move the temp file to the new path
                        fs.rename(oldPath, newPath, function(err) {
                            if(err) {
                                reject(new Error(err));
                            
                            } else {
                                resolve();

                            }
                        });
                    
                    }
                });
            }

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
            let mediaPath = this.getMediaPath() + id + '/*';
            
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
            let path = this.getMediaPath() + id;
            
            fs.readdir(path, (err, files) => {
                if(err) {
                    debug.error(err, this);
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
            let path = this.getMediaPath() + id;
            
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

        return path;
    }
}

module.exports = MediaHelper;
