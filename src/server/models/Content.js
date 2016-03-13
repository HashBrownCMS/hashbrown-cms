'use strict';

let crypto = require('crypto');

let Promise = require('bluebird');
let ContentHelper = require('../helpers/ContentHelper');
let Validator = require('jsonschema').Validator;

/**
 * The base class for all Content types
 */
class Content {
    constructor(data) {
        this.data = data;
    }

    /**
     * Creates a new Content object
     *
     * @return {Object} content
     */
    static create() {
        let content = new Content({});
        
        content.data.id = crypto.randomBytes(20).toString('hex');
    
        return content;
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
        let model = this;

        return new Promise(function(callback) {
            if(!view.schemaCache) {
                ContentHelper.getSchema(view.getType(), model.data.schemaId)
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
     * Gets the published state
     *
     * @return {Boolean} state
     */
    isPublished() {
        let unpublishDateIsNull = this.data.unpublishDate == null || typeof this.data.unpublishDate == 'undefined';
        let unpublishDateHasPassed = this.data.unpublishDate < Date.now()

        // Get the state
        return unpublishDateIsNull || unpublishDateHasPassed;
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

module.exports = Content;
