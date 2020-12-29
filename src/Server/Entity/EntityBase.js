'use strict';

const Crypto = require('crypto');

/**
 * The base class for everything
 *
 * @memberof HashBrown.Server.Entity
 */
class EntityBase extends require('Common/Entity/EntityBase') { 
    /**
     * Generates a new random id
     *
     * @param {Number} length
     *
     * @returns {String} id
     */
    static createId(length) {
        if(!length) { length = 8; }
        if(length < 4) { length = 4; }

        return Crypto.randomBytes(length).toString('hex');
    }
}

module.exports = EntityBase;
