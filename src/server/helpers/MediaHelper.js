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
     * @param {Boolean} isSingleFile
     *
     * @return {Function} handler
     */
    static getUploadHandler(isSingleFile) {
        let handler = multer({
            storage: multer.diskStorage({
                destination: (req, file, resolve) => {
                    let path = MediaHelper.getTempPath(req.project);
                   
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
       
        if(isSingleFile) {
            return handler.single('media');
        } else {
            return handler.array('media', 100);
        }
    }

    /**
     * Makes a directory recursively
     *
     * @param {String} dirPath
     * @param {Function} callback
     */
    static mkdirRecursively(
        dirPath = requiredParam('dirPath'),
        callback = null
    ) {
        let parents = dirPath.split('/');
        let finalPath = '/';

        for(let i in parents) {
            if(!parents[i]) { continue; }

            finalPath += parents[i];

            if(!fs.existsSync(finalPath)) {
                debug.log('Creating parent directory ' + finalPath + '...', this);
                fs.mkdirSync(finalPath);
            }

            if(i < parents.length - 1) {
                finalPath += '/';
            }
        }
        
        if(callback) {
            callback();
        }
    }

    /**
     * Sets a Media object
     *
     * @param {Number} id
     * @param {Object} file
     *
     * @return {Promise} promise
     */
    static setMediaData(
        id = requiredParam('id'),
        file = requiredParam('file')
    ) {
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
     * NOTE:
     * This method, as opposed to most other resource methods, does not merge
     * local and remote resources since it would be too complicated in the end
     *
     * @param {String} project
     * @param {String} environment
     *
     * @return {Promise(Object)} tree
     */
    static getTree(
        project = requiredParam('project'),
        environment = requiredParam('environment')
    ) {
        let collection = environment + '.media';
       
        return SyncHelper.getResource(project, environment, 'media/tree')
        .then((tree) => {
            if(!tree || tree.length < 1) {
                return MongoHelper.find(project, environment + '.media', {});
            }

            return Promise.resolve(tree);   
        });
    }
    
    /**
     * Sets a Media tree parent
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {Object} item
     *
     * @return {Promise} promise
     */
    static setTreeItem(
        project = requiredParam('project'),
        environment = requiredParam('environment'),       
        id = requiredParam('id'),
        item = requiredParam('item')
    ) {
        return SyncHelper.setResourceItem(project, environment, 'media/tree', id, item)
        .then((wasItemSet) => {
            if(wasItemSet) { return Promise.resolve(); }        

            // Remove the item if it's null
            if(!item) {
                return MongoHelper.removeOne(
                    project,
                    environment + '.media',
                    {
                        id: id
                    }
                );

            // If it's not, update the database document
            } else {
                item.id = id;

                return MongoHelper.updateOne(
                    project,
                    environment + '.media',
                    {
                        id: id
                    },
                    item,
                    {
                        upsert: true
                    }
                );
            }
        })
    }
    
    /**
     * Gets the media temp path
     *
     * @param {String} project
     *
     * @returns {String} path
     */
    static getTempPath(
        project = requiredParam('project')
    ) {
        let path = 
            appRoot +
            '/storage/' +
            project +
            '/temp';

        return path;
    }
}

module.exports = MediaHelper;
