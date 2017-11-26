'use strict';

const Crypto = require('crypto');

const DatabaseHelper = require('Server/Helpers/DatabaseHelper');
const ConfigHelper = require('Server/Helpers/ConfigHelper');

const User = require('Server/Models/User');

/**
 * A helper class for managing and getting information about CMS users
 *
 * @memberof HashBrown.Server.Helpers
 */
class UserHelper {
    /**
     * Sends a welcome message
     *
     * @param {String} email
     * @param {String} project
     *
     * @returns {Promise} Promise
     */
    static invite(email, project) {
        let token = Crypto.randomBytes(10).toString('hex');
        let user = User.create();

        user.inviteToken = token;
        user.email = email;
        user.scopes = {};

        if(project) {
            user.scopes[project] = [];
        }
        
        return DatabaseHelper.insertOne(
            'users',
            'users',
            user.getObject()
        ).then(() => {
            debug.log('Created new user "' + email + '" successfully', this);
             
            return Promise.resolve(token);
        });
    }

    /**
     * Finds a User by username
     *  
     * @param {String} username
     *
     * @returns {Promise(User)} user
     */
    static findUser(username) {
        return DatabaseHelper.findOne(
            'users',
            'users',
            {
                username: username
            }
        ).then((user) => {
            if(!user || Object.keys(user).length < 1) {
                return Promise.reject(new Error('No user "' + username + '" found'));
            }
            
            return Promise.resolve(new User(user));
        });
    }

    /**
     * Revokes all User tokens
     *
     * @returns {Promise} promise
     */
    static revokeTokens(username) {
        return findUser(username)
        .then((user) => {
            user.tokens = [];

            return this.updateUser(username, user.getObject());
        });
    }

    /**
     * Logs in a User
     *
     * @param {String} username
     * @param {String} password
     * @param {Boolean} persist
     *
     * @returns {Promise} Token
     */
    static loginUser(username, password, persist) {
        debug.log('Attempting login for user "' + username + '"...', this);

        return this.findUser(username)
        .then((user) => {
            if(user.validatePassword(password)) {
                let token = user.generateToken(persist);
               
                user.cleanUpTokens();

                return this.updateUser(username, user.getObject())
                .then(() => {
                    debug.log('User "' + username + '" logged in with token "' + token + '"', this);
                    return Promise.resolve(token);
                });
            } else {
                return Promise.reject(new Error('Invalid password'));
            }
        });
    }
    
    /**
     * Logs out a User
     *
     * @param {String} token
     *
     * @returns {Promise} Result
     */
    static logoutUser(token) {
        debug.log('Logging out user with "' + token + '"...', this);

        return this.findToken(token)
        .then((user) => {
            user.removeToken(token);

            return this.updateUser(user.username, user.getObject())
            .then(() => {
                debug.log('User "' + user.username + '" logged out', this);

                return Promise.resolve();
            });
        });
    }

    /**
     * Finds a token
     *  
     * @param {String} token
     *
     * @returns {Promise} User
     */
    static findToken(token) {
        return DatabaseHelper.find(
            'users',
            'users',
            {}
        )
        .then((users) => {
            for(let u of users) {
                let user = new User(u);
                
                let isValid = user.validateToken(token);

                if(isValid) {
                    return Promise.resolve(user);
                }
            }

            return Promise.resolve(null);
        });
    }
    
    /**
     * Finds an invite token
     *  
     * @param {String} inviteToken
     *
     * @returns {Promise} User
     */
    static findInviteToken(inviteToken) {
        return DatabaseHelper.findOne(
            'users',
            'users',
            {
                inviteToken: inviteToken
            }
        ).then((user) => {
            return new Promise((resolve, reject) => {
                if(user && Object.keys(user).length > 0) {
                    resolve(new User(user));
                
                } else {
                    reject(new Error('Invite token "' + inviteToken + '" could not be found'));

                }
            });  
        });
    }
    
    /**
     * Removes a User
     *
     * @param {String} id
     *
     * @returns {Promise} Promise
     */
    static removeUser(id) {
        return DatabaseHelper.removeOne(
            'users',
            'users',
            {
                id: id
            }
        ).then(() => {
            debug.log('Deleted user "' + id + '" successfully', this);
           
            return Promise.resolve();
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
        
        return HashBrown.Helpers.ProjectHelper.getProject(scope) 
        .then((result) => {
            project = result;

            if(project.users.length < 2) {
                return new Promise((resolve, reject) => {
                    reject(new Error('The last user can\'t be removed from a project. If you want to delete the project, please do so explicitly'));
                });
            
            } else {
                return DatabaseHelper.findOne('users', 'users', { id: id });
            }
        })
        .then((result) => {
            user = result;

            debug.log('Removing user "' + user.username + '" from project "' + project.name + '"', this);

            delete user.scopes[scope];
            
            return DatabaseHelper.updateOne('users', 'users', { id: id }, user);
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
        return DatabaseHelper.findOne('users', 'users', { id: id })
        .then((user) => {
            user.scopes  = user.scopes || {};

            user.scopes[project] = scopes || [];

            return this.updateUserById(id, user);
        });
    }

    /**
     * Activates an invited User
     *
     * @param {String} username
     * @param {String} password
     * @param {String} fullName
     * @param {String} inviteToken
     *
     * @returns {Promise} Login token
     */
    static activateUser(username, password, fullName, inviteToken) {
        let newUser;

        // Username check
        if(!username || username.length < 4) {
            return Promise.reject(new Error('Usernames must be at least 4 characters'));
        }
        
        // Password check
        if(!password || password.length < 4) {
            return Promise.reject(new Error('Passwords must be at least 4 characters'));
        }
        
        return this.findInviteToken(inviteToken)
        .then((user) => {
            user.fullName = user.fullName || fullName;
            user.username = username;
            user.setPassword(password);
            user.inviteToken = '';

            newUser = user;

            return DatabaseHelper.findOne(
                'users',
                'users',
                {
                    username: username
                }
            );
        }).then((existingUser) => {
            if(!existingUser) {
                console.log(newUser.getObject());

                return this.updateUserById(newUser.id, newUser.getObject());
            
            } else {
                return new Promise((resolve, reject) => {
                    reject(new Error('Username "' + username + '" is taken'));
                });

            }
        })
        .then(() => {
            return this.loginUser(username, password);
        });
    }

    /**
     * Creates a User
     *
     * @param {String} username
     * @param {String} password
     * @param {Boolean} admin
     * @param {Object} scopes
     *
     * @returns {Promise} promise
     */
    static createUser(username, password, admin, scopes) {
        if(!username) {
            return new Promise((resolve, reject) => {
                reject(new Error('Username was not provided'));
            });
        }
        
        if(!password) {
            return new Promise((resolve, reject) => {
                reject(new Error('Password was not provided'));
            });
        }
        
        let user = User.create(username, password);

        user.isAdmin = admin || false;
        user.scopes = scopes || {};

        return DatabaseHelper.findOne(
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
                
                return DatabaseHelper.insertOne(
                    'users',
                    'users',
                    user.getObject()
                ).then(() => {
                    debug.log('Created user "' + username + '" successfully', this);
                   
                    return new Promise((resolve) => {
                        resolve(user);
                    }); 
                });

            // Username matches an existing user
            } else {
                return new Promise((resolve, reject) => {
                    reject(new Error('Username "' + username + '" is taken'));
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
        let query = {};

        // Build query for project scope
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
            debug.log('Getting all users...', this, 3);
        }

        return DatabaseHelper.find(
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

            userModels.sort((a, b) => {
                return a.username > b.username;
            });

            return Promise.resolve(userModels);
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

        debug.log('Getting user "' + id + '"...', this, 3);

        return DatabaseHelper.findOne(
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

        debug.log('Getting user "' + username + '"...', this, 3);

        return DatabaseHelper.findOne(
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
        return this.findUser(username)
        .then((user) => {
            if(user) {
                user.cleanUpTokens();

                return this.updateUser(username, user.getObject());

            } else {
                return new Promise((resolve, reject) => {
                    reject(new Error('No user by username "' + username + '"'));
                });
            
            }
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
        if(properties.password && properties.password.length >= 4 && typeof properties.password === 'string') {
            properties.password = User.createPasswordHashSalt(properties.password);
        }
        
        return DatabaseHelper.mergeOne(
            'users',
            'users',
            {
                id: id
            },
            properties
        ).then(() => {
            debug.log('Updated user "' + id + '" successfully', this);
            
            return Promise.resolve(new User(properties));
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
        if(properties.password && properties.password.length >= 4 && typeof properties.password === 'string') {
            properties.password = User.createPasswordHashSalt(properties.password);
        }

        return DatabaseHelper.mergeOne(
            'users',
            'users',
            {
                username: username
            },
            properties
        ).then(() => {
            debug.log('Updated "' + username + '" successfully', this);
        });
    }
}

module.exports = UserHelper;
