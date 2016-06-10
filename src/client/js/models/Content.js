'use strict';

let ContentCommon = require('../../../common/models/Content');

/**
 * The client-side content model
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
            for(let node of window.resources.content) {
                if(node.id == id) {
                    callback(new Content(node));
                    return;
                }
            }
            
            // No node found
            callback(null);
        });
    }
}

module.exports = Content;
