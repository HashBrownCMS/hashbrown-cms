'use strict';

let User = require('../models/User');

/**
 * A helper class for managing and getting information about CMS users
 */
class UserHelper {
    /**
     * Finds a User by username
     *  
     * @param {String} username
     *
     * @returns {Promise(User)} user
     */
    static findUser(username) {
        return new Promise((resolve, reject) => {
            MongoHelper.findOne(
                'users',
                'users',
                {
                    username: username
                }
            ).then((user) => {
                resolve(new User(user));
            })
            .catch(reject);       
        });
    }

    /**
     * Revokes all User tokens
     *
     * @returns {Promise} promise
     */
    static revokeTokens(username) {
        return new Promise((resolve, reject) => {
            findUser(username)
            .then((user) => {
                user.tokens = [];

                UserHelper.updateUser(username, user.getObject())
                .then(resolve)
                .catch(reject); 
            })
            .catch(reject);
        });
    }

    /**
     * Logs in a User
     *
     * @param {String} username
     * @param {String} password
     *
     * @returns {Promise(String)} token
     */
    static loginUser(username, password) {
        return new Promise((resolve, reject) => {
            UserHelper.findUser(username)
            .then((user) => {
                if(user.validatePassword(password)) {
                    let token = user.generateToken();
                    
                    UserHelper.updateUser(username, user.getFields())
                    .then(() => {
                        resolve(token);
                    })
                    .catch(reject);
                } else {
                    reject(new Error('Invalid password'));
                }
            })
            .catch(reject);
        });
    }

    /**
     * Finds a token
     *  
     * @param {String} token
     *
     * @returns {Promise(User)} user
     */
    static findToken(token) {
        return new Promise((resolve, reject) => {
            MongoHelper.find(
                'users',
                'users',
                {}
            )
            .then((users) => {
                for(let u of users) {
                    let user = new User(u);
                    
                    let valid = user.validateToken(token);

                    if(valid) {
                        resolve(user);
                        return;
                    }
                }

                resolve(null);
            })
            .catch(reject);
        });
    }
    
    /**
     * Creates a User
     *
     * @param {Object} properties
     *
     * @returns {Promise} promise
     */
    static createUser(username, password) {
        let user = User.create(username, password);

        return new Promise((resolve, reject) => {
            MongoHelper.findOne(
                'users',
                'users',
                {
                    username: username
                }
            ).then((found) => {
                if(!found) {
                    debug.log('Creating user "' + username + '"...', this);
                    
                    MongoHelper.insertOne(
                        'users',
                        'users',
                        user.getFields()
                    ).then(() => {
                        debug.log('Created user "' + username + '" successfully.', this);
                        
                        resolve();
                    });
                } else {
                    reject(new Error('User with username "' + username + '" already exists'))

                }
            });
        });
    }

    /**
     * Gets a list of all users
     *
     * @returns {Promise(Array)} users
     */
    static getAllUsers() {
        debug.log('Getting all users...', this);

        return new Promise((resolve, reject) => {
            MongoHelper.find(
                'users',
                'users',
                {}
            ).then((users) => {
                resolve(users);
            });
        });
    }


    /**
     * Updates a User
     *
     * @param {String} username
     * @param {Object} properties
     *
     * @returns {Promise} promise
     */
    static updateUser(username, properties) {
        return new Promise((callback) => {
            MongoHelper.updateOne(
                'users',
                'users',
                {
                    username: username
                },
                properties
            ).then(() => {
                debug.log('Updated "' + username + '" successfully with properties: ' + JSON.stringify(properties), this);
                
                callback();
            });
        });
    }
}

module.exports = UserHelper;
