'use strict';

// Libs
let nodemailer = require('nodemailer');
let crypto = require('crypto');
let fs = require('fs');
let xoauth2 = require('xoauth2');

let User = require('../models/User');

/**
 * A helper class for managing and getting information about CMS users
 */
class UserHelper {
    /**
     * Initialises this helper
     */
    static init() {
        ConfigHelper.get('mail')
        .then((cfg) => {
            this.mailConfig = cfg;
            this.cachedAccessToken = this.mailConfig.accessToken;
        })
        .catch((e) => {
            debug.log('There was an error reading mail config: ' + e.message, this);
        });
    }

    /**
     * Sends an email
     *
     * @param {Object} mailOptions
     *
     * @returns {Promise} Promise
     */
    static sendEmail(mailOptions) {
        if(!this.mailConfig) {
            return Promise.reject(new Error('Email services are not configured for this instance'));
        }

        return new Promise((resolve, reject) => {
            let generator = xoauth2.createXOAuth2Generator({
                user: this.mailConfig.user,
                clientId: this.mailConfig.clientId,
                clientSecret: this.mailConfig.clientSecret,
                refreshToken: this.mailConfig.refreshToken,
                accessToken: this.cachedAccessToken
            });
            
            generator.on('token', (res) => {
                this.cachedAccessToken = res.accessToken;
            });

            let mailTransport = nodemailer.createTransport({
                service: this.mailConfig.service,
                auth: {
                    xoauth2: generator
                }
            });

            mailTransport.sendMail(mailOptions, (err, info) => {
                if(err){
                    reject(new Error(err));
                
                } else {
                    resolve('Message sent: ' + info.response);
                
                }
            });

        });
    }


    /**
     * Sends a welcome message
     *
     * @param {String} email
     * @param {String} project
     *
     * @returns {Promise} Promise
     */
    static invite(email, project) {
        if(!this.mailConfig) {
            return Promise.reject(new Error('Email services are not configured for this instance'));
        }

        let token = crypto.randomBytes(10).toString('hex');

        let mailOptions = {
            from: '"' + this.mailConfig.displayName + '" <' + this.mailConfig.email + '>',
            to: email,
            subject: 'Welcome to HashBrown',
            html: '<p>You have been kindly invited to join a HashBrown instance.</p><p>Please go to this URL to activate your account: <br />' + this.mailConfig.host + '/login?inviteToken=' + token
        };

        let user = User.create();

        user.inviteToken = token;
        user.email = email;
        user.scopes = {};

        if(project) {
            user.scopes[project] = [];
        }
        
        return this.sendEmail(mailOptions)
        .then((msg) => { 
            return MongoHelper.insertOne(
                'users',
                'users',
                user.getObject()
            ).then(() => {
                debug.log('Created new user "' + email + '" successfully', this);
                 
                return Promise.resolve(msg);
            });
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
        return MongoHelper.findOne(
            'users',
            'users',
            {
                username: username
            }
        ).then((user) => {
            return new Promise((resolve, reject) => {
                if(!user || Object.keys(user).length < 1) {
                    reject(new Error('No user "' + username + '" found'));
                } else {
                    resolve(new User(user));
                }
            });
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

            UserHelper.updateUser(username, user.getObject());
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
        return MongoHelper.find(
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
        return MongoHelper.findOne(
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
        return MongoHelper.removeOne(
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
        
        return UserHelper.findInviteToken(inviteToken)
        .then((user) => {
            user.fullName = user.fullName || fullName;
            user.username = username;
            user.setPassword(password);
            user.inviteToken = '';

            newUser = user;

            return MongoHelper.findOne(
                'users',
                'users',
                {
                    username: username
                }
            );
        }).then((existingUser) => {
            if(!existingUser) {
                return UserHelper.updateUserById(newUser.id, newUser.getObject());
            
            } else {
                return new Promise((resolve, reject) => {
                    reject(new Error('Username "' + username + '" is taken'));
                });

            }
        })
        .then(() => {
            return UserHelper.loginUser(username, password);
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

        return MongoHelper.find(
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

            return new Promise((resolve) => {
                resolve(userModels);
            });
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

        debug.log('Getting user "' + username + '"...', this, 3);

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
        if(typeof properties.password === 'string') {
            properties.password = User.createPasswordHashSalt(properties.password);
        }
        
        return MongoHelper.mergeOne(
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
        if(typeof properties.password === 'string') {
            properties.password = User.createPasswordHashSalt(properties.password);
        }

        return MongoHelper.mergeOne(
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

UserHelper.init();

module.exports = UserHelper;
