'use strict';

let crypto = require('crypto');

let Entity = require('../../common/models/Entity');
let UserCommon = require('../../common/models/User');

class Password extends Entity {
    structure() {
        this.def(String, 'hash');
        this.def(String, 'salt');
    }
}

class User extends UserCommon {
    constructor(params) {
        if(params && params.password) {
            // Ensure correct object type
            params.password = new Password({
                hash: params.password.hash,
                salt: params.password.salt
            });
        }

        super(params);
    }
    
    structure() {
        super.structure();

        this.def(Password, 'password', new Password());
        this.def(Array, 'tokens', []);
        this.def(String, 'inviteToken');
    }

    /**
     * Removes a token
     *
     * @param {String} token
     */
    removeToken(token) {
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
        this.inviteToken = null;
    }

    /**
     * Sets all project scopes
     *
     * @param {String} project
     * @param {Array} scopes
     */
    setScopes(project, scopes) {
        if(!this.scopes[project]) {
            this.scopes[project] = [];
        }

        this.scopes[project] = scopes;
    }
    
    /**
     * Creates a new access token
     *
     * @param {Boolean} persist
     */
    generateToken(persist) {
        let key = crypto.randomBytes(20).toString('hex');
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
        let hashedPassword = User.sha512(password, this.password.salt);

        return this.password.hash == hashedPassword;
    }

    /**
     * Set new password
     *
     * @param {String} password
     */
    setPassword(password) {
        let salt = crypto.randomBytes(128).toString('hex');
        let hashedPassword = User.sha512(password, salt);

        this.password.salt = salt;
        this.password.hash = hashedPassword;
    }

    /**
     * Creates a password hash and salt
     *
     * @param {String} password
     *
     * @returns {Object} Hash and salt
     */
    static createPasswordHashSalt(password) {
        let salt = crypto.randomBytes(128).toString('hex');
        let hashedPassword = User.sha512(password, salt);

        return {
            salt: salt,
            hash: hashedPassword
        };
    }

    /**
     * Creates a sha512 hash
     *
     * @param {String} string
     * @param {String} salt
     *
     * @returns {String} hash
     */
    static sha512(string, salt) {
        let hash = crypto.createHmac('sha512', salt);

        hash.update(string);

        let value = hash.digest('hex');

        return value;
    }

    /**
     * Creates a new user object
     *
     * @param {String} username
     * @param {String} password
     *
     * @returns {User} user
     */
    static create(username, password) {
        let passwordObj = {};
        
        if(password) {
            let salt = crypto.randomBytes(128).toString('hex');
            let hash = User.sha512(password, salt);

            passwordObj = {
                hash: hash,
                salt: salt
            }
        }
        
        let user = new User({
            id: Entity.createId(),
            username: username,
            password: passwordObj
        });

        return user;
    }
}

module.exports = User;
