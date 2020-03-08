'use strict';

const Crypto = require('crypto');

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
     * Clears all sensitive data
     */
    clearSensitiveData() {
        this.password = null;
        this.tokens = null;
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
            let isExpired = existingToken.expires != false && existingToken.expires < Date.now();

            if(isExpired) {
                this.tokens.splice(i, 1);

            } else if(existingToken.key == token) {
                return true;

            }
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

        let hashedPassword = User.sha512(password, this.password.salt);

        return this.password.hash == hashedPassword;
    }

    /**
     * Sets the password
     *
     * @param {String} password
     */
    setPassword(password) {
        checkParam(password, 'password', String, true);

        if(password.length < 5) {
            throw new Error('Password must be at least 5 characters long');
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
     * Checks for duplicate usernames
     *
     * @param {String} username
     *
     * @return {HashBrown.Entity.User} User
     */
    static async get(username) {
        checkParam(username, 'username', String, true);

        let user = await HashBrown.Service.DatabaseService.findOne('users', 'users', { username: username });

        if(!user) { return null; }

        return new this(user);
    }

    /**
     * Creates a new user object
     *
     * @param {String} username
     * @param {String} password
     * @param {Object} data
     *
     * @returns {HashBrown.Entity.User} user
     */
    static async create(username, password, data = {}) {
        checkParam(username, 'username', String, true);
        checkParam(password, 'password', String, true);
        checkParam(data, 'data', Object, true);
        
        let existingUser = await this.get(username);

        if(existingUser) {
            throw new Error(`User with username "${username}" already exists`);
        }
      
        let user = new this(data);
      
        user.id = this.createId();
        user.setPassword(password);

        await HashBrown.Service.DatabaseService.insertOne('users', 'users', user.getObject());

        return user;
    }

    /**
     * Saves a user in its current state
     */
    async save() {
        await HashBrown.Service.DatabaseService.updateOne('users', 'users', { id: this.id }, this.getObject());
    }
    
    /**
     * Removes this user
     */
    async remove() {
        await HashBrown.Service.DatabaseService.removeOne('users', 'users', { id: this.id });
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

        let user = await this.get(username);

        if(!user.validatePassword(password)) {
            throw new Error('Invalid password');
        }
        
        let token = user.generateToken(persist);
       
        user.cleanUpTokens();

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
