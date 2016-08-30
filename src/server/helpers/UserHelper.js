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
                if(Object.keys(user).length < 1) {
                    reject(new Error('No user "' + username + '" found'));
                } else {
                    resolve(new User(user));
                }
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
            debug.log('Attempting login for user "' + username + '"...', this);

            UserHelper.findUser(username)
            .then((user) => {
                if(user.validatePassword(password)) {
                    let token = user.generateToken();
                   
                    user.cleanUpTokens();

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
     * Removes a project scope from a User object
     *
     * @param {String} id
     * @param {String} scope
     *
     * @returns {Promise} Promise
     */
    static removeUserProjectScope(id, scope) {
        return new Promise((resolve, reject) => {
            MongoHelper.findOne(
                'users',
                'users',
                {
                    id: id
                }
            ).then((found) => {
                delete found.scopes[scope];

                MongoHelper.updateOne(
                    'users',
                    'users',
                    {
                        id: id
                    },
                    found
                )
                .then((user) => { resolve(user); })
                .catch(reject);
            })
            .catch(reject);
        });
    }

    /**
     * Creates a User
     *
     * @param {String} username
     * @param {String} password
     * @param {Object} scopes
     *
     * @returns {Promise} promise
     */
    static createUser(username, password, scopes) {
        let user = User.create(username, password);

        user.scopes = scopes;

        return new Promise((resolve, reject) => {
            MongoHelper.findOne(
                'users',
                'users',
                {
                    username: username
                }
            ).then((found) => {
                let foundUser = new User(found);

                // User wasn't found, create
                if(!found) {
                    debug.log('Creating user "' + username + '"...', this);
                    
                    MongoHelper.insertOne(
                        'users',
                        'users',
                        user.getFields()
                    ).then(() => {
                        debug.log('Created user "' + username + '" successfully.', this);
                        
                        resolve(user);
                    })
                    .catch(reject);

                // If scopes are defined and credentials match, just update the user
                } else if(
                    scopes &&
                    user.username === found.username &&
                    foundUser.validatePassword(password)
                ) {
                    for(let project in scopes) {
                        found.scopes[project] = scopes[project];
                    }

                    MongoHelper.updateOne(
                        'users',
                        'users',
                        {
                            username: username  
                        },
                        found
                    ).then(() => {
                        resolve(found);
                    })
                    .catch(reject);

                // Scopes are not defined, user is a duplicate
                } else {
                    reject(new Error('User with username "' + username + '" already exists'))

                }
            })
            .catch(reject);
        });
    }

    /**
     * Gets a list of all users
     *
     * @param {String} project
     *
     * @returns {Promise} Array of User objects
     */
    static getAllUsers(project) {
        let query = {};

        if(project) {
            debug.log('Getting all users with project "' + project + '" in scope...', this);

            query['scopes.' + project] = { $exists: true };

        } else {
            debug.log('Getting all users...', this);
        }

        return MongoHelper.find(
            'users',
            'users',
            query,
            {
                tokens: 0,
                password: 0
            }
        );
    }
    
    /**
     * Gets a single user
     *
     * @param {String} id
     *
     * @returns {Promise} User object
     */
    static getUserById(id) {
        let query = {};

        debug.log('Getting user "' + id + '"...', this);

        return MongoHelper.findOne(
            'users',
            'users',
            {
                id: id
            },
            {
                tokens: 0,
                password: 0
            }
        );
    }

    /**
     * Cleans up expired tokens
     *
     * @returns {Promise} promise
     */
    static cleanUpTokens(username) {
        return new Promise((resolve, reject) => {
            this.findUser(username)
            .then((user) => {
                if(user) {
                    user.cleanUpTokens();

                    this.updateUser(username, user.getObject())
                    .then(() => {
                        resolve();
                    })
                    .catch(reject);

                } else {
                    reject(new Error('No user by username "' + username + '"'))
                
                }
            })
            .catch(reject);
        });
    }
    
    /**
     * Updates a User by id
     *
     * @param {String} id
     * @param {Object} properties
     *
     * @returns {Promise} Promise
     */
    static updateUserById(id, properties) {
        return new Promise((callback) => {
            MongoHelper.mergeOne(
                'users',
                'users',
                {
                    id: id
                },
                properties
            ).then(() => {
                debug.log('Updated user "' + id + '" successfully with properties: ' + JSON.stringify(properties), this);
                
                callback();
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
            MongoHelper.mergeOne(
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
