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

    /**
     * Gets the schema information
     *
     * @return {Promise} promise
     */
    getSchema() {
        let model = this;

        return new Promise(function(callback) {
            if(!view.schemaCache) {
                ConnectionHelper.getSchema(view.getType(), model.data.schemaId)
                .then(function(schema) {
                    model.schemaCache = schema;

                    callback(model.schemaCache);
                });
            } else {
                callback(model.schemaCache);
            }
        });
    }

    /**
     * Validates the model based on the schema
     *
     * @return {Promise} promise
     */
    validateModel() {
        return new Promise(function(callback) {
            this.getSchema()
            .then(function(schema) {
                let validator = new Validator();

                let result = validator.validate(this.data, schema);

                console.log(result);
            });
        });
    }    
}

module.exports = Connection;
