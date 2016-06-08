'use strict';

let crypto = require('crypto');

let Entity = require('../../common/models/Entity');

class Admin extends Entity {
    structure() {
        this.id = '';
        this.username = '';
        this.password = {
            hash: '',
            salt: ''   
        };
        this.tokens = [];
    
        Object.seal(this.password);
    }

    /**
     * Creates a new access token
     */
    generateToken() {
        let key = crypto.randomBytes(20).toString('hex');
        let validDuration =
            1 * // Days
            24 * // Hours
            60 * // Minutes
            60 * // Seconds
            1000; // Milliseconds

        let expires = Date.now() + validDuration;
        
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
            let isExpired = existingToken.expires < Date.now();
                
            if(isExpired) {
                this.tokens.splice(i, 1);
            } else if(existingToken.key == token) {
                return true;
            }
        }

        return false;
    }

    /**
     * Validate password
     *
     * @param {String} password
     *
     * @returns {Boolean} valid
     */
    validatePassword(password) {
        let hashedPassword = Admin.sha512(password, this.password.salt);

        return this.password.hash == hashedPassword;
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
     * Creates a new admin object
     *
     * @param {String} username
     * @param {String} password
     *
     * @returns {Admin} admin
     */
    static create(username, password) {
        let salt = crypto.randomBytes(128).toString('hex');
        let hashedPassword = Admin.sha512(password, salt);
        
        let admin = new Admin({
            id: Entity.createId(),
            username: username,
            password: {
                hash: hashedPassword,
                salt: salt
            }
        });

        return admin;
    }
}

module.exports = Admin;
