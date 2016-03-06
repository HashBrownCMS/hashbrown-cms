'use strict';

let Promise = require('bluebird');
let ContentHelper = require('../helpers/ContentHelper');
let Validator = require('jsonschema').Validator;

/**
 * The base class for all Content types
 */
class Content {
    constructor(model) {
        this.model = model;

        this.validateSchema();
    }

    /**
     * Gets the content type
     *
     * @return {String} type
     */
    getType() {
        return this.constructor.name;
    }

    /**
     * Gets the schema information
     *
     * @return {Promise} promise
     */
    getSchema() {
        let view = this;

        return new Promise(function(callback) {
            if(!view.schemaCache) {
                ContentHelper.getSchema(view.getType(), view.model.schemaId)
                .then(function(schema) {
                    view.schemaCache = schema;

                    callback(view.schemaCache);
                });
            } else {
                callback(view.schemaCache);
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

                let result = validator.validate(this.model, schema);

                console.log(result);
            };
        });
    }    
}
