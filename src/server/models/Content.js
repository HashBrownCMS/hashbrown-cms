'use strict';

let ContentCommon = require('../../common/models/Content');

/**
 * The server-side content model
 */
class Content extends ContentCommon {
    /**
     * Finds a Content object
     *
     * @param {String} id
     *
     * @returns {Content} content
     */
    static find(id) {
        return new Promise((callback) => {
            ContentHelper.getContentById(id)
            .then((node) => {
                callback(new Content(node));
            });
            return;
            
            // No node found
            callback(null);
        });
    }

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
