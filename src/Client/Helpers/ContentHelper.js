'use strict';

const ContentHelperCommon = require('Common/Helpers/ContentHelper');

/**
 * The client side content helper
 *
 * @memberof HashBrown.Client.Helpers
 */
class ContentHelper extends ContentHelperCommon {
    /**
     * Gets all ancestors of a Content node by id
     *
     * @param {String} id
     * @param {Boolean} includeSelf
     *
     * @returns {Array} Content node
     */
    static async getContentAncestorsById(id, includeSelf = false) {
        checkParam(id, 'id', String, true);

        let ancestors = [];
        let ancestorId = id;

        while(ancestorId) {
            let ancestor = await this.getContentById(ancestorId);

            if(ancestorId !== id || includeSelf) {
                ancestors.push(ancestor);
            }
            
            ancestorId = ancestor.parentId;
        }

        ancestors.reverse();

        return ancestors;
    }
    
    /**
     * Gets Content by id
     *
     * @param {String} id
     *
     * @returns {HashBrown.Models.Content} Content node
     */
    static async getContentById(id) {
        checkParam(id, 'id', String, true);

        return await HashBrown.Helpers.ResourceHelper.get(HashBrown.Models.Content, 'content', id);
    }
    
    /**
     * Gets all Content
     *
     * @returns {Array} Content nodes
     */
    static async getAllContent() {
        return await HashBrown.Helpers.ResourceHelper.getAll(HashBrown.Models.Content, 'content');
    }
    
    /**
     * Sets Content by id
     *
     * @param {String} id
     * @param {HashBrown.Models.Content} content
     */
    static setContentById(id, content) {
        checkParam(id, 'id', String);
        checkParam(content, 'content', HashBrown.Models.Content);

        return HashBrown.Helpers.ResourceHelper.set('content', id, content);
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
     *
     * @return {Object} Checked value
     */
    static fieldSanityCheck(value, definition) {
        // If the definition value is set to multilingual, but the value isn't an object, convert it
        if(definition.multilingual && (!value || typeof value !== 'object')) {
            let oldValue = value;

            value = {};
            value[HashBrown.Context.language] = oldValue;
        }

        // If the definition value is not set to multilingual, but the value is an object
        // containing the _multilingual flag, convert it
        if(!definition.multilingual && value && typeof value === 'object' && value._multilingual) {
            value = value[HashBrown.Context.language];
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
     *
     * @return {Number} New index
     */
    static async getNewSortIndex(parentId, aboveId, belowId) {
        if(aboveId) {
            let aboveContent = await this.getContentById(aboveId);
            
            return aboveContent.sort + 1;
        }

        if(belowId) {
            let belowContent = await this.getContentById(belowId);
            
            return belowContent.sort + 1;
        }

        // Filter out content that doesn't have the same parent
        let allContent = await HashBrown.Helpers.ContentHelper.getAllContent();
        
        allContent.filter((x) => {
            return x.parentId == parentId || (!x.parentId && !parentId);
        });

        // Find new index
        // NOTE: The index should be the highest sort number + 10000 to give a bit of leg room for sorting later
        let newIndex = 10000;

        for(let content of allContent) {
            if(newIndex - 10000 <= content.sort) {
                newIndex = content.sort + 10000;
            }
        }

        return newIndex;
    }

    /**
     * Starts a tour of the Content section
     */
    static async startTour() {
        if(location.hash.indexOf('content/') < 0) {
            location.hash = '/content/';
        }
       
        await new Promise((resolve) => { setTimeout(() => { resolve(); }, 500); });
            
        await UI.highlight('.navbar-main__tab[data-route="/content/"]', 'This the Content section, where you will do all of your authoring.', 'right', 'next');

        await UI.highlight('.navbar-main__pane[data-route="/content/"]', 'Here you will find all of your authored Content, like webpages. You can right click here to create a Content node.', 'right', 'next');
        
        let editor = document.querySelector('.editor--content');

        if(editor) {
            await UI.highlight('.editor--content', 'This is the Content editor, where you edit Content nodes.', 'left', 'next');
        } else {
            await UI.highlight('.page--environment__space--editor', 'This is where the Content editor will be when you click a Content node.', 'left', 'next');
        }
    }
}

module.exports = ContentHelper;
