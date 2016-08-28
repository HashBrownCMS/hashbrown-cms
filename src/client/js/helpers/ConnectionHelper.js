'use strict';

let ConnectionHelperCommon = require('../../../common/helpers/ConnectionHelper');

let Connection = require('../../../common/models/Connection');

class ConnectionHelper extends ConnectionHelperCommon {
    /**
     * Gets all connections
     *
     * @return {Promise(Connection[])} promise
     */
    static getAllConnections() {
        return new Promise((resolve, reject) => {
            resolve(resources.connections);
        });
    }
    
    /**
     * Gets a Connection by id
     *
     * @param {string} id
     *
     * @return {Promise(Connection)} promise
     */
    static getConnectionById(id) {
        return new Promise((resolve, reject) => {
            for(let i in resources.connections) {
                let connection = resources.connections[i];

                if(connection.id == id) {
                    resolve(connection);
                    return;
                }
            }

            reject(new Error('No Connection by id "' + id + '" was found'));
        });
    }
}

module.exports = ConnectionHelper;
