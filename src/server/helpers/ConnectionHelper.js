'use strict';

let Connection = require(appRoot + '/src/common/models/Connection');

// Promise
let Promise = require('bluebird');

class ConnectionHelper {
    /**
     * Registers a connection type
     *
     * @param {String} name
     * @param {Connection} connection
     */
    static registerConnectionType(name, connection) {
        if(!ConnectionHelper.connectionTypes) {
            ConnectionHelper.connectionTypes = {};
        }

        ConnectionHelper.connectionTypes[name] = connection;
    }

    /**
     * Inits a connection with the appropriate constructor
     *
     * @param {Object} data
     *
     * @returns {Connection} connection
     */
    static initConnection(data) {
        let constructor = ConnectionHelper.connectionTypes[data.type];
           
        if(typeof constructor === 'function') {
            return new constructor(data);
        } else {
            return new Connection(data);
        }
    }

    /**
     * Publishes content
     *
     * @param {Content} content
     *
     * @returns {Promise} promise
     */
    static publishContent(content) {
        return new Promise((callback) => {
            console.log('[ConnectionHelper] Publishing content "' + content.id + '"...');
            
            content.getSettings('publishing')
            .then((settings) => {
                if(settings.connections && settings.connections.length > 0) {
                    console.log('[ConnectionHelper] Looping through ' + settings.connections.length + ' connections...');
                    
                    function nextConnection(i) {
                        ConnectionHelper.getConnectionById(settings.connections[i])
                        .then((connection) => {
                            console.log('[ConnectionHelper] Publishing through connection "' + settings.connections[i] + '" of type "' + connection.type + '"...');

                            connection.publishContent(content)
                            .then(() => {
                                i++;

                                if(i < settings.connections.length) {
                                    nextConnection(i);
                                
                                } else {
                                    console.log('[ConnectionHelper] Published content "' + content.id + '" successfully!');

                                    callback();
                                
                                }
                            });
                        });
                    }

                    nextConnection(0);
                
                } else {
                    throw '[ConnectionHelper] No connections defined for content "' + content.id + '"';
                }
            });
        }); 
    }

    /**
     * Gets all connections
     * This method must be overridden by a plugin
     *
     * @return {Promise} promise
     */
    static getAllConnections() {
        return new Promise(function(callback) {
            callback([]);   
        });
    }
    
    /**
     * Get a connection by id
     * This method must be overridden by a plugin
     *
     * @param {String} id
     *
     * @return {Promise} promise
     */
    static getConnectionById(id) {
        return new Promise(function(callback) {
            callback([]);   
        });
    }

    /**
     * Set a connection by id
     * This method must be overridden by a plugin
     *
     * @param {String} id
     * @param {Object} content
     *
     * @return {Promise} promise
     */
    static setConnectionById(id, content) {
        return new Promise(function(callback) {
            callback([]);   
        });
    }
    
    /**
     * Set a connection setting by id
     * This method must be overridden by a plugin
     *
     * @param {String} id
     * @param {Object} content
     *
     * @return {Promise} promise
     */
    static setConnectionSettingById(id, content) {
        return new Promise(function(callback) {
            callback([]);   
        });
    }

    /**
     * Creates a new connection
     * This method must be overridden by a plugin
     *
     * @return {Promise} promise
     */
    static createConnection() {
        let connection = Connection.create();

        return new Promise(function(callback) {
            callback(connection.data);   
        });
    }
    
    /**
     * Removes a connection by id
     * This method must be overridden by a plugin
     *
     * @param {String} id
     *
     * @return {Promise} promise
     */
    static removeConnectionById(id) {
        return new Promise(function(callback) {
            callback();   
        });
    }
}

module.exports = ConnectionHelper;
