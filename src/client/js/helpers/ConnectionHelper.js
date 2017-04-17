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
        return Promise.resolve(resources.connections);
    }
    
    /**
     * Gets a Connection by id (sync)
     *
     * @param {string} id
     *
     * @return {Promise} Connection
     */
    static getConnectionByIdSync(
        id = requiredParam('id')
    ) {
        for(let i in resources.connections) {
            let connection = resources.connections[i];

            if(connection.id == id) {
                return connection;
            }
        }
    }
    
    /**
     * Gets a Connection by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {string} id
     *
     * @return {Promise(Connection)} promise
     */
    static getConnectionById(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        id = requiredParam('id')
    ) {
        for(let i in resources.connections) {
            let connection = resources.connections[i];

            if(connection.id == id) {
                return Promise.resolve(connection);
            }
        }

        return Promise.reject(new Error('No Connection by id "' + id + '" was found'));
    }
}

module.exports = ConnectionHelper;
