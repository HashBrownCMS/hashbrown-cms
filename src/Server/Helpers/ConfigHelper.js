'use strict';

const FileSystem = require('fs');
const Path = require('path');

// We don't want to be querying the file system every time
let cache = {};

/**
 * A helper class for reading and writing config files
 *
 * @memberof HashBrown.Server.Helpers
 */
class ConfigHelper {
    /**
     * Sets a config section
     *
     * @param {String} name
     * @param {Object} config
     *
     * @returns {Promise}
     */
    static set(name, config) {
        checkParam(name, 'name', String);
        checkParam(config, 'config', Object);

        return new Promise((resolve, reject) => {
            let path = Path.join(APP_ROOT, 'config', name + '.cfg');

            FileSystem.writeFile(path, JSON.stringify(config), 'utf8', (err, data) => {
                if(err) {
                    reject(err);

                } else {
                    delete cache[name];

                    resolve();

                }
            });
        });
    }
    
    /**
     * Gets whether a config section exists
     *
     * @param {String} name
     *
     * @returns {Boolean} Config section exists
     */
    static existsSync(name) {
        checkParam(name, 'name', String);
       
        let path = Path.join(APP_ROOT, 'config', name + '.cfg');

        try {
            FileSystem.statSync(path);

            return true;
        } catch(e) {
            return false;
        }
    }
    
    /**
     * Gets whether a config section exists
     *
     * @param {String} name
     *
     * @returns {Promise} Config section exists
     */
    static exists(name) {
        checkParam(name, 'name', String);
       
        let path = Path.join(APP_ROOT, 'config', name + '.cfg');

        return new Promise((resolve, reject) => {
            FileSystem.stat(path, (err, stats) => {
                if(err) {
                    return resolve(false);
                }

                resolve(true);
            });
        });
    }
        
    /**
     * Gets a particular config section
     *
     * @param {String} name
     *
     * @returns {Promise} Config object
     */
    static get(name) {
        checkParam(name, 'name', String);
       
        if(cache[name]) { 
            return Promise.resolve(cache[name]);
        }

        return new Promise((resolve, reject) => {
            let path = Path.join(APP_ROOT, 'config', name + '.cfg');

            FileSystem.exists(path, (exists) => {
                if(exists) {
                    FileSystem.readFile(path, (err, data) => {
                        if(err) {
                            reject(err);

                        } else {
                            try {
                                let result = JSON.parse(data);

                                cache[name] = result;

                                resolve(result);

                            } catch(e) {
                                reject(e);
                            
                            }
                        }
                    });
            
                } else {
                    reject(new Error('Config "' + name + '" could not be found'));

                }
            });
        });
    }
    
    /**
     * Gets a particular config section synchronously
     * This method throws away all error messages
     *
     * @param {String} name
     *
     * @returns {Object} Config object
     */
    static getSync(name) {
        checkParam(name, 'name', String);
       
        if(cache[name]) {
            return cache[name];
        }

        let path = Path.join(APP_ROOT, 'config', name + '.cfg');

        if(!FileSystem.existsSync(path)) { return {}; }

        let data = FileSystem.readFileSync(path);

        if(!data) { return {}; }

        try {
            return JSON.parse(data);

        } catch(e) {
            return {};

        }
    }
}

module.exports = ConfigHelper;

