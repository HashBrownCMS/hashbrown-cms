'use strict';

const Crypto = require('crypto');
const Path = require('path');

/**
 * A model for Users
 *
 * @memberof HashBrown.Server.Entity
 */
class User extends require('Common/Entity/User') {
    structure() {
        super.structure();

        this.def(Object, 'password', {});
        this.def(Array, 'tokens', []);
    }

    /**
     * Removes a token
     *
     * @param {String} token
     */
    removeToken(token) {
        checkParam(token, 'token', String, true);

        for(let i in this.tokens) {
            if(this.tokens[i].key === token) {
                this.tokens.splice(i, 1);
                break;
            }
        }
    }

    /**
     * Creates a new access token
     *
     * @param {Boolean} persist
     */
    generateToken(persist = false) {
        checkParam(persist, 'persist', Boolean);

        let key = Crypto.randomBytes(20).toString('hex');
        let validDuration =
            8 * // Hours
            60 * // Minutes
            60 * // Seconds
            1000; // Milliseconds

        let expires = persist ? false : Date.now() + validDuration;
        
        let token = {
            key: key,
            expires: expires
        };

        this.tokens.push(token);

        return key;
    }

    /**
     * Validate token
     *
     * @param {String} token
     *
     * @returns {Boolean} valid
     */
    validateToken(token) {
        checkParam(token, 'token', String, true);

        for(let i = this.tokens.length - 1; i >= 0; i--) {
            let existingToken = this.tokens[i];
            let isExpired = existingToken.expires !== false && existingToken.expires < Date.now();

            if(isExpired || existingToken.key !== token) { continue; }

            return true;
        }

        return false;
    }

    /**
     * Cleans up expired tokens
     */
    cleanUpTokens() {
        for(let i = this.tokens.length - 1; i >= 0; i--) {
            let existingToken = this.tokens[i];
            let isExpired = existingToken.expires != false && existingToken.expires < Date.now();
            
            if(isExpired) {
                this.tokens.splice(i, 1);
            }
        }
    }

    /**
     * Validate password
     *
     * @param {String} password
     *
     * @returns {Boolean} valid
     */
    validatePassword(password) {
        checkParam(password, 'password', String, true);

        if(!this.password) { return false; }

        let hash = Crypto.createHmac('sha512', this.password.salt);
        hash.update(password);
        hash = hash.digest('hex');
        
        return this.password.hash === hash;
    }

    /**
     * Sets the password
     *
     * @param {String} password
     */
    setPassword(password) {
        checkParam(password, 'password', String, true);

        if(password.length < 4) {
            throw new Error('Password must be at least 4 characters long');
        }

        let salt = Crypto.randomBytes(128).toString('hex');
        let hash = Crypto.createHmac('sha512', salt);

        hash.update(password);
        hash = hash.digest('hex');

        this.password = {
            hash: hash,
            salt: salt
        };
    }
    
    /**
     * Gets a user by token
     *
     * @param {String} token
     * @param {Object} options
     *
     * @return {HashBrown.Entity.User} User
     */
    static async getByToken(token, options) {
        checkParam(token, 'token', String);
        checkParam(options, 'options', Object, true);

        if(!token) { return null; }

        let users = await HashBrown.Service.DatabaseService.find('system', 'users', {});

        for(let user of users) {
            user = this.new(user);

            if(!user.validateToken(token)) { continue; }

            if(!options.withTokens) {
                user.tokens = [];
            }
            
            if(!options.withPassword) {
                user.password = null;
            }

            let localePath = Path.join(APP_ROOT, 'i18n', user.locale + '.json');

            if(HashBrown.Service.FileService.exists(localePath)) {
                user.localeConfig = require(localePath);
            }

            return user;
        }
        
        return null;
    }
    
    /**
     * Gets all users
     *
     * @param {Object} options
     *
     * @return {Array} Users
     */
    static async list(options = {}) {
        checkParam(options, 'options', Object, true);

        let users = await HashBrown.Service.DatabaseService.find('system', 'users', {});

        for(let i in users) {
            users[i] = this.new(users[i]);
        
            if(!options.withTokens) {
                users[i].tokens = [];
            }
        
            if(!options.withPassword) {
                users[i].password = null;
            }
        }
        
        users = users.sort((a, b) => {
            a = a.getName();
            b = b.getName();

            a = a.toLowerCase();
            b = b.toLowerCase();

            if(a < b) { return -1; }
            if(a > b) { return 1; }

            return 0;
        });

        return users;
    }
    
    /**
     * Gets a user by id
     *
     * @param {String} id
     * @param {Object} options
     *
     * @return {HashBrown.Entity.User} User
     */
    static async get(id, options = {}) {
        checkParam(id, 'id', String, true);
        checkParam(options, 'options', Object, true);

        let user = await HashBrown.Service.DatabaseService.findOne('system', 'users', { id: id });

        if(!user) { return null; }

        if(!options.withTokens) {
            user.tokens = [];
        }
        
        if(!options.withPassword) {
            user.password = null;
        }

        return this.new(user);
    }
    
    /**
     * Gets a user by username
     *
     * @param {String} username
     * @param {Object} options
     *
     * @return {HashBrown.Entity.User} User
     */
    static async getByUsername(username, options = {}) {
        checkParam(username, 'username', String, true);
        checkParam(options, 'options', Object, true);

        let user = await HashBrown.Service.DatabaseService.findOne('system', 'users', { username: username });

        if(!user) { return null; }

        if(!options.withTokens) {
            user.tokens = [];
        }
        
        if(!options.withPassword) {
            user.password = null;
        }

        return this.new(user);
    }

    /**
     * Creates a new user object
     *
     * @param {Object} options
     *
     * @returns {HashBrown.Entity.User} User
     */
    static async create(options = {}) {
        checkParam(options, 'options', Object, true);
        checkParam(options.username, 'options.username', String, true);
        checkParam(options.password, 'options.password', String, true);
     
        if(options.username.length < 2) {
            throw new Error('The username must be at least 2 characters long');
        }

        let existingUser = await this.getByUsername(options.username);

        if(existingUser) {
            throw new Error(`User with username "${options.username}" already exists`);
        }
    
        let user = this.new(options);
      
        user.id = this.createId();
        user.setPassword(options.password);

        await HashBrown.Service.DatabaseService.insertOne('system', 'users', user.getObject());

        user.tokens = [];
        user.password = null;

        return user;
    }

    /**
     * Saves a user in its current state
     *
     * @param {Object} options
     */
    async save(options = {}) {
        this.cleanUpTokens();
           
        if(options.password) {
            this.setPassword(options.password);
        }

        if(this.username.length < 2) {
            throw new Error('Username must be minimum 2 characters long'); 
        }

        await HashBrown.Service.DatabaseService.updateOne('system', 'users', { id: this.id }, this.getObject());
    }
    
    /**
     * Removes this user
     */
    async remove() {
        await HashBrown.Service.DatabaseService.removeOne('system', 'users', { id: this.id });
    }
    
    /**
     * Logs in a user
     *
     * @param {String} username
     * @param {String} password
     * @param {Boolean} persist
     *
     * @returns {String} Token
     */
    static async login(username, password, persist = false) {
        checkParam(username, 'username', String, true);
        checkParam(password, 'password', String, true);
        checkParam(persist, 'persist', Boolean);

        let user = await this.getByUsername(username, { withPassword: true, withTokens: true });

        if(!user) {
            throw new Error('User not found');
        }

        if(!user.validatePassword(password)) {
            throw new Error('Invalid password');
        }
        
        let token = user.generateToken(persist);
       
        await user.save();
        
        return token;
    }
    
    /**
     * Logs out this user
     *
     * @param {String} token
     */
    async logout(token) {
        checkParam(token, 'token', String, true);

        if(token) {
            this.removeToken(token);
        }

        await this.save();
    }
}

module.exports = User;
