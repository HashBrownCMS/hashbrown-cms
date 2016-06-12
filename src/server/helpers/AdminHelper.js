'use strict';

let Admin = require('../models/Admin');

/**
 * A helper class for managing and getting information about CMS admins
 */
class AdminHelper {
    /**
     * Finds an Admin by username
     *  
     * @param {String} username
     *
     * @returns {Promise(Admin)} promise
     */
    static findAdmin(username) {
        return new Promise((callback) => {
            MongoHelper.findOne(
                'users',
                'admins',
                {
                    username: username
                }
            ).then((admin) => {
                callback(new Admin(admin));
            });       
        });
    }
    
    /**
     * Finds a token
     *  
     * @param {String} token
     *
     * @returns {Promise(Boolean)} promise
     */
    static findToken(token) {
        return new Promise((callback) => {
            MongoHelper.find(
                'users',
                'admins',
                {}
            ).then((admins) => {
                for(let a of admins) {
                    let admin = new Admin(a);
                    
                    let valid = admin.validateToken(token);

                    if(valid) {
                        callback(true);
                        return;
                    }
                }

                callback(false);
            });       
        });
    }
    
    /**
     * Creates an Admin
     *
     * @param {Object} properties
     *
     * @returns {Promise} promise
     */
    static createAdmin(username, password) {
        let admin = Admin.create(username, password);

        console.log('[AdminHelper] Creating admin "' + username + '"...');

        return new Promise((callback) => {
            MongoHelper.insertOne(
                'users',
                'admins',
                admin.getFields()
            ).then(() => {
                console.log('[AdminHelper] Created admin "' + username + '" successfully.');
                
                callback();
            });
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
            MongoHelper.updateOne(
                'users',
                'admins',
                {
                    username: username
                },
                properties
            ).then(() => {
                callback();
            });
        });
    }
}

module.exports = AdminHelper;
