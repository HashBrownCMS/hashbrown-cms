'use strict';

const Crypto = require('crypto');

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
    static async invite(email, project) {
        let token = Crypto.randomBytes(10).toString('hex');
        let user = HashBrown.Models.User.create();

        user.inviteToken = token;
        user.email = email;
        user.scopes = {};

        if(project) {
            user.scopes[project] = [];
        }
        
        await HashBrown.Helpers.DatabaseHelper.insertOne('users', 'users', user.getObject());

        return token;
    }

    /**
     * Finds a User by username
     *  
     * @param {String} username
     *
     * @returns {User} user
     */
    static async findUser(username) {
        let user = await HashBrown.Helpers.DatabaseHelper.findOne('users', 'users', { username: username });

        if(!user || Object.keys(user).length < 1) {
            throw new Error('No user "' + username + '" found');
        }
            
        return new HashBrown.Models.User(user);
    }

    /**
     * Revokes all User tokens
     */
    static async revokeTokens(username) {
        let user = await findUser(username);

        user.tokens = [];

        await this.updateUser(username, user.getObject());
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
    static async loginUser(username, password, persist) {
        debug.log('Attempting login for user "' + username + '"...', this);

        let user = await this.findUser(username);

        if(!user.validatePassword(password)) {
            throw new Error('Invalid password');
        }
        
        let token = user.generateToken(persist);
       
        user.cleanUpTokens();

        await this.updateUser(username, user.getObject());

        return token;
    }
    
    /**
     * Logs out a User
     *
     * @param {String} token
     *
     * @returns {Promise} Result
     */
    static async logoutUser(token) {
        debug.log('Logging out user with "' + token + '"...', this);

        let user = await this.findToken(token);
        
        user.removeToken(token);

        await this.updateUser(user.username, user.getObject());
    }

    /**
     * Finds a token
     *  
     * @param {String} token
     *
     * @returns {Promise} User
     */
    static async findToken(token) {
        let users = await HashBrown.Helpers.DatabaseHelper.find('users', 'users', {});

        for(let u of users) {
            let user = new HashBrown.Models.User(u);
            
            let isValid = user.validateToken(token);

            if(isValid) {
                return user;
            }
        }

        return null;
    }
    
    /**
     * Finds an invite token
     *  
     * @param {String} inviteToken
     *
     * @returns {Promise} User
     */
    static async findInviteToken(inviteToken) {
        let user = await HashBrown.Helpers.DatabaseHelper.findOne('users', 'users', { inviteToken: inviteToken });

        if(!user || Object.keys(user).length < 1) {
            throw new Error('Invite token "' + inviteToken + '" could not be found');
        }
        
        return new HashBrown.Models.User(user);
    }
    
    /**
     * Removes a User
     *
     * @param {String} id
     *
     * @returns {Promise} Promise
     */
    static async removeUser(id) {
        await HashBrown.Helpers.DatabaseHelper.removeOne('users', 'users', { id: id });
    }

    /**
     * Removes a Project scope from a User object
     *
     * @param {String} id
     * @param {String} scope
     */
    static async removeUserProjectScope(id, scope) {
        let project = await HashBrown.Helpers.ProjectHelper.getProject(scope);

        if(project.users.length < 2) {
            throw new Error('The last user can\'t be removed from a project. If you want to delete the project, please do so explicitly');
        }
        
        let user = await HashBrown.Helpers.DatabaseHelper.findOne('users', 'users', { id: id });

        debug.log('Removing user "' + user.username + '" from project "' + project.name + '"', this);

        delete user.scopes[scope];
        
        await HashBrown.Helpers.DatabaseHelper.updateOne('users', 'users', { id: id }, user);
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
    static async addUserProjectScope(id, project, scopes) {
        let user = await HashBrown.Helpers.DatabaseHelper.findOne('users', 'users', { id: id });

        user.scopes  = user.scopes || {};
        user.scopes[project] = scopes || [];

        await this.updateUserById(id, user);
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
    static async activateUser(username, password, fullName, inviteToken) {
        // Username check
        if(!username || username.length < 4) {
            throw new Error('Usernames must be at least 4 characters');
        }
        
        // Password check
        if(!password || password.length < 4) {
            throw new Error('Passwords must be at least 4 characters');
        }
        
        let user = await this.findInviteToken(inviteToken)
        
        user.fullName = user.fullName || fullName;
        user.username = username;
        user.setPassword(password);
        user.inviteToken = '';

        let existingUser = await HashBrown.Helpers.DatabaseHelper.findOne('users', 'users', { username: username });
        
        if(existingUser) {
            throw new Error('Username "' + username + '" is taken');
        }
        
        await this.updateUserById(user.id, user.getObject());
        
        return await this.loginUser(username, password);
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
    static async createUser(username, password, admin, scopes) {
        checkParam(username, 'username', String, true);
        checkParam(username, 'password', String, true);

        let user = HashBrown.Models.User.create(username, password);

        user.isAdmin = admin || false;
        user.scopes = scopes || {};

        let foundUser = await HashBrown.Helpers.DatabaseHelper.findOne('users', 'users', { username: username })

        if(foundUser) {
            throw new Error('Username "' + username + '" is taken');
        }
            
        await HashBrown.Helpers.DatabaseHelper.insertOne('users', 'users', user.getObject());

        return user;
    }

    /**
     * Makes a User an admin
     *
     * @param {String} username
     */
    static async makeUserAdmin(username) {
        let user = await this.getUser(username);

        user.isAdmin = true;

        await this.updateUser(username, user);
    }

    /**
     * Gets a list of all users
     *
     * @param {String} project
     *
     * @returns {Promise} Array of User objects
     */
    static async getAllUsers(project) {
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

        let users = await HashBrown.Helpers.DatabaseHelper.find('users', 'users', query, { tokens: 0, password: 0 });

        let userModels = [];
        
        users = users.sort((a, b) => {
            a = a.fullName || a.username || a.email;
            b = b.fullName || b.username || b.email;

            if(a < b) { return -1; }
            if(a > b) { return 1; }
            return 0;
        });

        for(let user of users) {
            userModels.push(new HashBrown.Models.User(user));
        }  

        return userModels;
    }
    
    /**
     * Gets a single User by id
     *
     * @param {String} id
     *
     * @returns {Promise} User object
     */
    static async getUserById(id) {
        checkParam(id, 'id', String);
        
        let query = {};

        let user = await HashBrown.Helpers.DatabaseHelper.findOne('users', 'users', { id: id }, { tokens: 0, password: 0 });

        if(!user) { throw new Error('User "' + id + '" could not be found'); }

        return user;
    }
    
    /**
     * Gets a single User
     *
     * @param {String} username
     *
     * @returns {Promise} User object
     */
    static async getUser(username) {
        let query = {};

        debug.log('Getting user "' + username + '"...', this, 3);

        return await HashBrown.Helpers.DatabaseHelper.findOne('users', 'users', { username: username }, { tokens: 0, password: 0 });
    }

    /**
     * Cleans up expired tokens
     */
    static async cleanUpTokens(username) {
        let user = await this.findUser(username);
        
        if(!user) {
            throw new Error('No user by username "' + username + '"');
        }

        user.cleanUpTokens();

        await this.updateUser(username, user.getObject());
    }
    
    /**
     * Updates a User by id
     *
     * @param {String} id
     * @param {Object} properties
     *
     * @returns {Promise} Promise
     */
    static async updateUserById(id, properties) {
        if(properties.password && properties.password.length >= 4 && typeof properties.password === 'string') {
            properties.password = HashBrown.Models.User.createPasswordHashSalt(properties.password);
        }
        
        await HashBrown.Helpers.DatabaseHelper.mergeOne('users', 'users', { id: id }, properties);

        return new HashBrown.Models.User(properties);
    }

    /**
     * Updates a User
     *
     * @param {String} username
     * @param {Object} properties
     *
     * @returns {Promise} promise
     */
    static async updateUser(username, properties) {
        if(properties.password && properties.password.length >= 4 && typeof properties.password === 'string') {
            properties.password = HashBrown.Models.User.createPasswordHashSalt(properties.password);
        }

        await HashBrown.Helpers.DatabaseHelper.mergeOne('users', 'users', { username: username }, properties);
    }
}

module.exports = UserHelper;
