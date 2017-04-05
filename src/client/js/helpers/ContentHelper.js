'use strict';

let ContentHelperCommon = require('../../../common/helpers/ContentHelper');

let Content = require('../models/Content');

class ContentHelper extends ContentHelperCommon {
    /**
     * Gets Content by id
     *
     * @param {String} id
     *
     * @returns {Content} Content node
     */
    static getContentByIdSync(id) {
        if(id) {
            for(let content of resources.content) {
                if(content.id == id) {
                    return new Content(content);
                }
            }
        }

        return null;
    }
    
    /**
     * Gets Content by id
     *
     * @param {String} id
     *
     * @returns {Promise} Content node
     */
    static getContentById(id) {
        if(id) {
            for(let content of resources.content) {
                if(content.id == id) {
                    return Promise.resolve(new Content(content));
                }
            }
           
            return Promise.reject(new Error('Content with id "' + id + '" was not found'));
        
        } else {
            return Promise.reject(new Error('Content id was not provided'));

        }
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
