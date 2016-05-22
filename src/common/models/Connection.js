'use strict';

let crypto = require('crypto');

let Promise = require('bluebird');
let Validator = require('jsonschema').Validator;

/**
 * The base class for all Connection types
 */
class Connection {
    constructor(properties) {
        this.properties = properties;
    }

    /**
     * Creates a new Connection object
     *
     * @param {Object} properties
     *
     * @return {Object} content
     */
    static create(properties) {
        let connection = new Connection(properties || {});
        
        connection.properties.id = crypto.randomBytes(20).toString('hex');
        connection.properties.title = 'New connection';
        connection.properties.settings = {};

        return connection;
    }
}

module.exports = Connection;
