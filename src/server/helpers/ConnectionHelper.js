'use strict';

let Connection = require(appRoot + '/src/server/models/Connection');

// Promise
let Promise = require('bluebird');

class ConnectionHelper {
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
