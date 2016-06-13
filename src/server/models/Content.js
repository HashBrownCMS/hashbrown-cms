'use strict';

let ContentCommon = require('../../common/models/Content');

/**
 * The server-side content model
 */
class Content extends ContentCommon {
    /**
     * Gets the schema information
     *
     * @returns {Promise} promise
     */
    getSchema() {
        ContentHelper.getSchema(view.getType(), model.schemaId)
        .then(function(schema) {
            callback(schema);
        });
    }
}

module.exports = Content;
