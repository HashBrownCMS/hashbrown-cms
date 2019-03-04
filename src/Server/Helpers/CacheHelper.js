'use strict';

const FileSystem = require('fs');
const Path = require('path');

/**
 * A helper class for managing disk cache
 *
 * @memberof HashBrown.Server.Helpers
 */
class CacheHelper {
    /**
     * Sets a cache object
     *
     * @param {String} key
     * @param {Object} value
     */
    static set(key, value) {
        checkParam(key, 'key', String);
        checkParam(value, 'value', Object);
            
        return new Promise((resolve, reject) => {
            this.checkCacheFolder();

            let path = Path.join(APP_ROOT, 'storage', 'cache', Buffer.from(key).toString('base64'));

            FileSystem.writeFile(path, JSON.stringify(value), 'utf8', (err, data) => {
                if(err) {
                    reject(err);

                } else {
                    resolve();

                }
            });
        });
    }
    
    /**
     * Gets a cache object
     *
     * @param {String} key
     *
     * @returns {*} Cache object
     */
    static get(key) {
        checkParam(key, 'key', String);
       
        return new Promise((resolve, reject) => {
            this.checkCacheFolder();

            let path = Path.join(APP_ROOT, 'storage', 'cache', Buffer.from(key).toString('base64'));

            FileSystem.exists(path, (exists) => {
                if(exists) {
                    FileSystem.readFile(path, (err, data) => {
                        if(err) {
                            reject(err);

                        } else {
                            try {
                                let result = JSON.parse(data);

                                resolve(result);

                            } catch(e) {
                                reject(e);
                            
                            }
                        }
                    });
            
                } else {
                    resolve(null);

                }
            });
        });
    }

    /**
     * Removes a cache object
     *
     * @param {String} key
     */
    static remove(key) {
        checkParam(key, 'key', String);
       
        return new Promise((resolve, reject) => {
            this.checkCacheFolder();

            let path = Path.join(APP_ROOT, 'storage', 'cache', Buffer.from(key, 'base64').toString('utf8'));

            FileSystem.unlink(path, () => {
                resolve();
            });
        });
    }

    /**
     * Makes sure the cache folder is present
     */
    static checkCacheFolder() {
        let storagePath = Path.join(APP_ROOT, 'storage');
        let cachePath = Path.join(APP_ROOT, 'storage', 'cache');

        if(!FileSystem.existsSync(storagePath)) {
            FileSystem.mkdirSync(storagePath);
        }
        
        if(!FileSystem.existsSync(cachePath)) {
            FileSystem.mkdirSync(cachePath);
        }
    }
}

module.exports = CacheHelper;
