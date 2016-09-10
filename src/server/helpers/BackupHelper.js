'use strict';

// Libs
let fs = require('fs');
let glob = require('glob');
let multer = require('multer');

/**
 * A helper class for managing backups
 */
class BackupHelper {
    /**
     * Gets the upload handler
     *
     * @return {Function} handler
     */
    static getUploadHandler() {
        let handler = multer({
            storage: multer.diskStorage({
                destination: (req, file, resolve) => {
                    let path = appRoot + '/dump/' + req.params.project + '/';
                   
                    debug.log('Handling file upload to dump storage...', this);

                    if(!fs.existsSync(path)){
                        MediaHelper.mkdirRecursively(path, () => {
                            resolve(null, path);
                        });
                    
                    } else {
                        resolve(null, path);

                    }
                }
            })
        });
        
        return handler.single('backup');
    }
    
    /**
     * Gets a list of backups for a project
     *
     * @param {String} projectName
     *
     * @returns {Array} List of backup names as strings
     */
    static getBackupsForProject(projectName) {
        return new Promise((resolve, reject) => {
            glob(appRoot + '/dump/' + projectName + '/*.hba', (err, files) => {
                if(err) {
                    reject(new Error(err));
                } else {
                    for(let i in files) {
                        files[i] = files[i].replace(appRoot + '/dump/' + projectName + '/', '').replace('.hba', '');
                    }

                    resolve(files);
                }
            });
        });
    }

    /**
     * Restores a backup for a project
     *
     * @param {String} projectName
     * @param {String} timestamp
     *
     * @returns {Promise} Promise
     */
    static restoreBackup(projectName, timestamp) {
        return MongoHelper.restore(projectName, timestamp);
    }
    

    /**
     * Creates a backup for a project
     *
     * @param {String} projectName
     *
     * @returns {Promise} Promise
     */
    static createBackup(projectName) {
        return MongoHelper.dump(projectName);
    }

    /**
     * Deletes a backup
     *
     * @param {String} projectName
     * @param {String} timestamp
     *
     * @returns {Promise} Promise
     */
    static deleteBackup(projectName, timestamp) {
        return new Promise((resolve, reject) => {
            let path = appRoot + '/dump/' + projectName + '/' + timestamp + '.hba';

            if(fs.existsSync(path)) {
                fs.unlinkSync(path);
                resolve();

            } else {
                reject(new Error('Backup for project "' + projectName + '" width timestamp "' + timestamp + '" could not be found'));
            }
        });
    }

    /**
     * Gets the file path for a backup
     *
     * @param {String} projectName
     * @param {String} timestamp
     *
     * @returns {Promise} The backup file path
     */
    static getBackupPath(projectName, timestamp) {
        return new Promise((resolve, reject) => {
            let path = appRoot + '/dump/' + projectName + '/' + timestamp + '.hba';

            if(fs.existsSync(path)) {
                resolve(path);
            
            } else {
                reject(new Error('Project backup for "' + projectName + '" with timestamp "' + timestamp + '" could not be found'));
            
            }
        });
    }
}

module.exports = BackupHelper;
