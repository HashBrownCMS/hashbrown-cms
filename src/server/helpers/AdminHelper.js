'use strict';

let Promise = require('bluebird');

/**
 * A helper class for managing and getting information about CMS admins
 */
class AdminHelper {
    /**
     * Finds a token
     *  
     * @param {String} token
     *
     * @returns {Promise(Boolean)} promise
     */
    static findToken(token) {
        return new Promise((callback) => {
            callback(false);
        });
    }
    
    /**
     * Finds an Admin by username
     *  
     * @param {String} username
     *
     * @returns {Promise(Admin)} promise
     */
    static findAdmin(username) {
        return new Promise((callback) => {
            callback();
        });
    }

    /**
     * Updates an Admin
     *
     * @param {String} username
     * @param {Object} properties
     *
     * @returns {Promise} promise
     */
    static updateAdmin(username, properties) {
        return new Promise((callback) => {
            callback();
        });
    }
    
    /**
     * Creates an Admin
     *
     * @param {Object} properties
     *
     * @returns {Promise} promise
     */
    static createAdmin(properties) {
        return new Promise((callback) => {
            callback();
        });
    }
}

module.exports = AdminHelper;
