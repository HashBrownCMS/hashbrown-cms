'use strict';

let ContentCommon = require('../../common/models/Content');

/**
 * The server-side content model
 */
class Content extends ContentCommon {
    /**
     * Gets the schema information
     *
     * @returns {Promise(ContentSchema)} promise
     */
    getSchema() {
        return new Promise((resolve, reject) => {
            SchemaHelper.getSchemaById(this.schemaId)
            .then((schema) => {
                resolve(schema);
            });
        });
    }
}

module.exports = Content;
