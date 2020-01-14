'use strict';

const Crypto = require('crypto');

/**
 * A helper class for managing and getting information about CMS users
 *
 * @memberof HashBrown.Server.Service
 */
class UserService {
    /**
     * Finds a User by username
     *  
     * @param {String} username
     *
     * @returns {User} user
     */
    static async findUser(username) {
        let user = await HashBrown.Service.DatabaseService.findOne('users', 'users', { username: username });

        if(!user || Object.keys(user).length < 1) {
            throw new Error('No user "' + username + '" found');
        }
            
        return new HashBrown.Entity.Resource.User(user);
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
        let user = await this.findToken(token);
        
        user.removeToken(token);

        await this.updateUserById(user.id, user.getObject());
    }

    /**
     * Finds a token
     *  
     * @param {String} token
     *
     * @returns {Promise} User
     */
    static async findToken(token) {
        let users = await HashBrown.Service.DatabaseService.find('users', 'users', {});

        for(let u of users) {
            let user = new HashBrown.Entity.Resource.User(u);
            
            let isValid = user.validateToken(token);

            if(isValid) {
                return user;
            }
        }

        return null;
    }
    
    /**
     * Removes a User
     *
     * @param {String} id
     *
     * @returns {Promise} Promise
     */
    static async removeUser(id) {
        await HashBrown.Service.DatabaseService.removeOne('users', 'users', { id: id });
    }

    /**
     * Removes a Project scope from a User object
     *
     * @param {String} id
     * @param {String} scope
     */
    static async removeUserProjectScope(id, scope) {
        let project = await HashBrown.Service.ProjectService.getProject(scope);

        if(project.users.length < 2) {
            throw new Error('The last user can\'t be removed from a project. If you want to delete the project, please do so explicitly');
        }
        
        let user = await HashBrown.Service.DatabaseService.findOne('users', 'users', { id: id });

        delete user.scopes[scope];
        
        await HashBrown.Service.DatabaseService.updateOne('users', 'users', { id: id }, user);
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
        let user = await HashBrown.Service.DatabaseService.findOne('users', 'users', { id: id });

        user.scopes  = user.scopes || {};
        user.scopes[project] = scopes || [];

        await this.updateUserById(id, user);
    }

    /**
     * Checks for duplicate usernames
     *
     * @param {String} id
     * @param {String} username
     */
    static async duplicateUsernameCheck(id, username) {
        checkParam(id, 'id', String, true);
        checkParam(username, 'username', String, true);

        let user = await HashBrown.Service.DatabaseService.findOne('users', 'users', { username: username })

        if(user && user.id !== id) {
            throw new Error('Username "' + username + '" is already taken');
        }
    }

    /**
     * Creates a User
     *
     * @param {String} username
     * @param {String} password
     * @param {Boolean} isAdmin
     * @param {Object} params
     *
     * @returns {Promise} promise
     */
    static async createUser(username, password, isAdmin = false, params = {}) {
        checkParam(username, 'username', String, true);
        checkParam(password, 'password', String, true);

        delete params['username'];
        delete params['password'];

        let user = HashBrown.Entity.Resource.User.create(username, password);

        for(let key in params) {
            user[key] = params[key];
        }

        user.isAdmin = isAdmin;

        await this.duplicateUsernameCheck(user.id, username);
        
        await HashBrown.Service.DatabaseService.insertOne('users', 'users', user.getObject());

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
            let projectScopeQuery = {};
            projectScopeQuery['scopes.' + project] = { $exists: true };

            let isAdminQuery = { isAdmin: true };

            query['$or'] = [
                projectScopeQuery,
                isAdminQuery
            ];
        }

        let users = await HashBrown.Service.DatabaseService.find('users', 'users', query, { tokens: 0, password: 0 });

        let userEntity = [];
        
        users = users.sort((a, b) => {
            a = a.fullName || a.username || a.email || '';
            b = b.fullName || b.username || b.email || '';

            a = a.toLowerCase();
            b = b.toLowerCase();

            if(a < b) { return -1; }
            if(a > b) { return 1; }
            return 0;
        });

        for(let user of users) {
            userEntity.push(new HashBrown.Entity.Resource.User(user));
        }  

        return userEntity;
    }
    
    /**
     * Gets a single User by id
     *
     * @param {String} id
     *
     * @returns {HashBrown.Entity.Resource.User} User object
     */
    static async getUserById(id) {
        checkParam(id, 'id', String);
        
        let query = {};

        let user = await HashBrown.Service.DatabaseService.findOne('users', 'users', { id: id }, { tokens: 0, password: 0 });

        if(!user) { return null; }

        return new HashBrown.Entity.Resource.User(user);
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

        return await HashBrown.Service.DatabaseService.findOne('users', 'users', { username: username }, { tokens: 0, password: 0 });
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
            properties.password = HashBrown.Entity.Resource.User.createPasswordHashSalt(properties.password);
        }
        
        delete properties.id;
       
        if(properties.username) {
            await this.duplicateUsernameCheck(id, properties.username);
        }
        
        await HashBrown.Service.DatabaseService.mergeOne('users', 'users', { id: id }, properties);

        return new HashBrown.Entity.Resource.User(properties);
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
            properties.password = HashBrown.Entity.Resource.User.createPasswordHashSalt(properties.password);
        }

        delete properties.id;
        delete properties.username;

        await HashBrown.Service.DatabaseService.mergeOne('users', 'users', { username: username }, properties);
    }
}

module.exports = UserService;
