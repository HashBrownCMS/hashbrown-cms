'use strict';

let fs = require('fs');

class ConfigHelper {
    /**
     * Gets a particular config section
     *
     * @param {String} name
     *
     * @returns {Promise} Config object
     */
    static get(name) {
        return new Promise((resolve, reject) => {
            let path = appRoot + '/config/' + name + '.cfg';

            fs.exists(path, (exists) => {
                if(exists) {
                    fs.readFile(path, (err, data) => {
                        if(err) {
                            reject(err);

                        } else {
                            try {
                                resolve(JSON.parse(data));

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
        let path = appRoot + '/config/' + name + '.cfg';

        if(!fs.existsSync(path)) { return {}; }

        let data = fs.readFileSync(path);

        if(!data) { return {}; }

        try {
            return JSON.parse(data);

        } catch(e) {
            return {};

        }
    }
}

module.exports = ConfigHelper;

