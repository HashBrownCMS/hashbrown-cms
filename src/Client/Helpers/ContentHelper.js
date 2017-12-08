'use strict';

const RequestHelper = require('Client/Helpers/RequestHelper');

const ContentHelperCommon = require('Common/Helpers/ContentHelper');

const Content = require('Client/Models/Content');

/**
 * The client side content helper
 *
 * @memberof HashBrown.Client.Helpers
 */
class ContentHelper extends ContentHelperCommon {
    /**
     * Gets Content by id
     *
     * @param {String} id
     *
     * @returns {Content} Content node
     */
    static getContentByIdSync(id) {
        if(!id) { return null; }

        for(let content of resources.content) {
            if(content.id === id) {
                return content;
            }
        }
    }
    
    /**
     * Gets Content by id
     *
     * @param {String} id
     *
     * @returns {Promise} Content node
     */
    static getContentById(id) {
        if(!id) { return Promise.resolve(null); }

        return RequestHelper.request('get', 'content/' + id)
        .then((content) => {
            return Promise.resolve(new Content(content));
        });
    }
    
    /**
     * Sets Content by id
     *
     * @param {String} id
     * @param {Content} content
     *
     * @returns {Promise} Content node
     */
    static setContentById(id, content) {
        checkParam(id, 'id', String);
        checkParam(content, 'content', HashBrown.Models.Content);

        return RequestHelper.request('post', 'content/' + id, content.getObject())
        .then((content) => {
            return Promise.resolve(content);
        });
    }

    /**
     * A sanity check for fields
     *
     * @param {Object} value
     * @param {Schema} schema
     */
    static fieldSanityCheck(value, schema) {
        // If the schema value is set to multilingual, but the value isn't an object, convert it
        if(schema.multilingual && (!value || typeof value !== 'object')) {
            let oldValue = value;

            value = {};
            value[window.language] = oldValue;
        }

        // If the schema value is not set to multilingual, but the value is an object
        // containing the _multilingual flag, convert it
        if(!schema.multilingual && value && typeof value === 'object' && value._multilingual) {
            value = value[window.language];
        }

        // Update the _multilingual flag
        if(schema.multilingual && value && !value._multilingual) {
            value._multilingual = true;    
        
        } else if(!schema.multilingual && value && value._multilingual) {
            delete value._multilingual;

        }

        return value;
    }

    /**
     * Get new sort index
     *
     * @param {String} parentId
     * @param {String} aboveId
     * @param {String} belowId
     */
    static getNewSortIndex(parentId, aboveId, belowId) {
        if(aboveId) {
            return this.getContentByIdSync(aboveId).sort + 1;
        }

        if(belowId) {
            return this.getContentByIdSync(belowId).sort - 1;
        }

        // Filter out content that doesn't have the same parent
        let nodes = resources.content.filter((x) => {
            return x.parentId == parentId || (!x.parentId && !parentId);
        });

        // Find new index
        // NOTE: The index should be the highest sort number + 10000 to give a bit of leg room for sorting later
        let newIndex = 10000;

        for(let content of nodes) {
            if(newIndex - 10000 <= content.sort) {
                newIndex = content.sort + 10000;
            }
        }

        return newIndex;
    }
}

module.exports = ContentHelper;
