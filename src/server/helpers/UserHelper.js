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
     * Removes a Project scope from a User object
     *
     * @param {String} id
     * @param {String} scope
     *
     * @returns {Promise} Promise
     */
    static removeUserProjectScope(id, scope) {
        let user;
        let project;
        
        return ProjectHelper.getProject(scope) 
        .then((result) => {
            project = result;

            if(project.users.length < 2) {
                return new Promise((resolve, reject) => {
                    reject(new Error('The last user can\'t be removed from a project. If you want to delete the project, please do so explicitly'));
                });
            
            } else {
                return MongoHelper.findOne('users', 'users', { id: id });
            }
        })
        .then((result) => {
            user = result;

            debug.log('Removing user "' + user.username + '" from project "' + project.name + '"', this);

            delete user.scopes[scope];
            
            return MongoHelper.updateOne('users', 'users', { id: id }, user);
        });
    }
    
    /**
     * Adds a Project scope to a User object
     *
     * @param {String} id
     * @param {String} project
     * @param {Array} scopes
     *
     * @returns {Promise} Promise
     */
    static addUserProjectScope(id, project, scopes) {
        return MongoHelper.findOne('users', 'users', { id: id })
        .then((user) => {
            user.scopes  = user.scopes || {};

            user.scopes[project] = scopes || [];

            return this.updateUserById(id, user);
        });
    }

    /**
     * Creates a User
     *
     * @param {String} username
     * @param {String} password
     * @param {Boolean} admin
     *
     * @returns {Promise} promise
     */
    static createUser(username, password, admin) {
        if(!username) {
            return new Promise((resolve, reject) => {
                reject(new Error('Create user: Username was not provided'));
            });
        }
        
        if(!password) {
            return new Promise((resolve, reject) => {
                reject(new Error('Create user: Password was not provided'));
            });
        }
        
        let user = User.create(username, password);

        user.isAdmin = admin || false;

        return MongoHelper.findOne(
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
                
                return MongoHelper.insertOne(
                    'users',
                    'users',
                    user.getFields()
                ).then(() => {
                    debug.log('Created user "' + username + '" successfully', this);
                   
                    return new Promise((resolve) => {
                        resolve(user);
                    }); 
                });

            // Username matches an existing user
            } else {
                return new Promise((resolve, reject) => {
                    reject(new Error('Username already exists'));
                });
            }
        });
    }

    /**
     * Makes a User an admin
     *
     * @param {String} username
     *
     * @returns {Promise} Promise
     */
    static makeUserAdmin(username) {
        return this.getUser(username)
        .then((user) => {
            user.isAdmin = true;

            return this.updateUser(username, user);
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
        return new Promise((resolve, reject) => {
            let query = {};

            if(project) {
                debug.log('Getting all users with project "' + project + '" in scope...', this, 3);

                let projectScopeQuery = {};
                projectScopeQuery['scopes.' + project] = { $exists: true };

                let isAdminQuery = { isAdmin: true };

                query['$or'] = [
                    projectScopeQuery,
                    isAdminQuery
                ];

            } else {
                debug.log('Getting all users...', this);
            }

            MongoHelper.find(
                'users',
                'users',
                query,
                {
                    tokens: 0,
                    password: 0
                }
            )
            .then((users) => {
                let userModels = [];

                for(let user of users) {
                    userModels.push(new User(user));
                }  

                resolve(userModels);
            })
            .catch(reject);
        });
    }
    
    /**
     * Gets a single User by id
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
     * Gets a single User
     *
     * @param {String} username
     *
     * @returns {Promise} User object
     */
    static getUser(username) {
        let query = {};

        debug.log('Getting user "' + username + '"...', this);

        return MongoHelper.findOne(
            'users',
            'users',
            {
                username: username
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
                debug.log('Updated user "' + id + '" successfully', this);
                
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
                debug.log('Updated "' + username + '" successfully', this);
                
                callback();
            });
        });
    }
}

module.exports = UserHelper;
