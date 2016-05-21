'use strict';

let crypto = require('crypto');

let Promise = require('bluebird');
let ConnectionHelper = require('../helpers/ConnectionHelper');
let Validator = require('jsonschema').Validator;

/**
 * The base class for all Connection types
 */
class Connection {
    constructor(data) {
        this.data = data;
    }

    /**
     * Creates a new Connection object
     *
     * @param {Object} data
     *
     * @return {Object} content
     */
    static create(data) {
        let connection = new Connection(data || {});
        
        connection.data.id = crypto.randomBytes(20).toString('hex');
        connection.data.title = 'New connection';
        connection.data.settings = {};

        return connection;
    }
}

module.exports = Connection;
