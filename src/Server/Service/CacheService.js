'use strict';

const FileSystem = require('fs');
const Path = require('path');

let cache = {};

/**
 * A helper class for managing disk cache
 *
 * @memberof HashBrown.Server.Service
 */
class CacheService {
    /**
     * Sets a cache object in memory
     *
     * @param {String} key
     * @param {*} value
     */
    static setMemory(key, value) {
        checkParam(key, 'key', String);
        
        cache[key] = value;
    }
    
    /**
     * Gets a cache object from memory
     *
     * @param {String} key
     *
     * @returns {*} Cache value
     */
    static getMemory(key) {
        checkParam(key, 'key', String);

        return cache[key];
    }

    /**
     * Removes a cache object from memory
     *
     * @param {String} key
     */
    static removeMemory(key) {
        checkParam(key, 'key', String);

        delete cache[key];
    }

    /**
     * Sets a cache object to file
     *
     * @param {String} key
     * @param {Object} value
     */
    static setFile(key, value) {
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
     * Gets a cache object from file
     *
     * @param {String} key
     *
     * @returns {*} Cache object
     */
    static getFile(key) {
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
     * Removes a cache object from file
     *
     * @param {String} key
     */
    static removeFile(key) {
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

module.exports = CacheService;
