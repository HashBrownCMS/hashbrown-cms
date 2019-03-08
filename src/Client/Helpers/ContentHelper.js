'use strict';

const ContentHelperCommon = require('Common/Helpers/ContentHelper');

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

        return HashBrown.Helpers.RequestHelper.request('get', 'content/' + id)
        .then((content) => {
            return Promise.resolve(new HashBrown.Models.Content(content));
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

        return HashBrown.Helpers.RequestHelper.request('post', 'content/' + id, content.getObject())
        .then((content) => {
            return Promise.resolve(content);
        });
    }

    /**
     * A check for field definitions
     *
     * @param {Object} definition
     *
     * @return {Boolean} Whether or not the definition is empty
     */
    static isFieldDefinitionEmpty(definition) {
        if(!definition) { return true; }

        let isEmpty = true;
        let checkRecursive = (object) => {
            if(!object) { return; }

            // We consider a definition not empty, if it has a value that is not an object
            // Remember, null is of type 'object' too
            if(typeof object !== 'object') { return isEmpty = false; }

            for(let k in object) {
                checkRecursive(object[k]);
            }
        };
            
        checkRecursive(definition);

        return isEmpty;
    }

    /**
     * A sanity check for fields
     *
     * @param {Object} value
     * @param {Object} definition
     */
    static fieldSanityCheck(value, definition) {
        // If the definition value is set to multilingual, but the value isn't an object, convert it
        if(definition.multilingual && (!value || typeof value !== 'object')) {
            let oldValue = value;

            value = {};
            value[window.language] = oldValue;
        }

        // If the definition value is not set to multilingual, but the value is an object
        // containing the _multilingual flag, convert it
        if(!definition.multilingual && value && typeof value === 'object' && value._multilingual) {
            value = value[window.language];
        }

        // Update the _multilingual flag
        if(definition.multilingual && value && !value._multilingual) {
            value._multilingual = true;    
        
        } else if(!definition.multilingual && value && value._multilingual) {
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

    /**
     * Starts a tour of the Content section
     */
    static startTour() {
        if(location.hash.indexOf('content/') < 0) {
            location.hash = '/content/';
        }
       
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        })
        .then(() => {
            return UI.highlight('.navbar-main__tab[data-route="/content/"]', 'This the Content section, where you will do all of your authoring.', 'right', 'next')
        })
        .then(() => {
            return UI.highlight('.navbar-main__pane[data-route="/content/"]', 'Here you will find all of your authored Content, like webpages. You can right click here to create a Content node.', 'right', 'next');
        })
        .then(() => {
            let editor = document.querySelector('.editor--content');

            if(!editor) {
                return UI.highlight('.page--environment__space--editor', 'This is where the Content editor will be when you click a Content node.', 'left', 'next');
            }
                
            return UI.highlight('.editor--content', 'This is the Content editor, where you edit Content nodes.', 'left', 'next');
        });
    }
}

module.exports = ContentHelper;
