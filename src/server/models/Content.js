'use strict';

let ContentHelper = require('../helpers/ContentHelper');

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
}

module.exports = Content;
