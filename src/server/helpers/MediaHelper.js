'use strict';

// Lib
let glob = require('glob');
let path = require('path');
let fs = require('fs');
let rimraf = require('rimraf');
let multer = require('multer');

// Models
let Media = require('../models/Media');

let MediaHelperCommon = require('../../common/helpers/MediaHelper');

class MediaHelper extends MediaHelperCommon {
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
                   
                    debug.log('Handling file upload to temp storage...', this);

                    if(!fs.existsSync(path)){
                        this.mkdirRecursively(path, () => {
                            resolve(null, path);
                        });
                    
                    } else {
                        resolve(null, path);

                    }
                },
                filename: (req, file, resolve) => {
                    let split = file.originalname.split('.');
                    let name = split[0];
                    let extension = split[1];

                    name = name.replace(/\W+/g, '-').toLowerCase();
                   
                    if(extension) {
                        name += '.' + extension;
                    }

                    resolve(null, name);
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
     * Gets the Media tree
     *
     * @return {Promise(Object)} tree
     */
    static getTree() {
        let collection = ProjectHelper.currentEnvironment + '.media';
        
        return MongoHelper.find(
            ProjectHelper.currentProject,
            collection,
            {}
        );
    }
    
    /**
     * Sets a Media tree parent
     *
     * @param {String} id
     * @param {Object} item
     *
     * @return {Promise} promise
     */
    static setTreeItem(id, item) {
        let collection = ProjectHelper.currentEnvironment + '.media';

        // Remove the item if  its' null
        if(!item) {
            return MongoHelper.removeOne(
                ProjectHelper.currentProject,
                collection,
                {
                    id: id
                }
            );

        // If it's not, update the database document
        } else {
            return MongoHelper.updateOne(
                ProjectHelper.currentProject,
                collection,
                {
                    id: id
                },
                item,
                {
                    upsert: true
                }
            );
        }
    }
    
    /**
     * Gets the media temp path
     *
     * @returns {String} path
     */
    static getTempPath() {
        let path = 
            appRoot +
            '/storage/' +
            ProjectHelper.currentProject +
            '/temp';

        return path;
    }
}

module.exports = MediaHelper;
