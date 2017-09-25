'use strict';

let Schema = require('./Schema');

/**
 * Schema for content nodes
 *
 * @memberof HashBrown.Common.Models
 */
class ContentSchema extends Schema {
    constructor(properties) {
        super(properties);
    }
    
    structure() {
        super.structure();

        this.def(String, 'defaultTabId');
        this.def(Object, 'tabs', {});
        this.def(Object, 'fields', {});
        this.def(Array, 'allowedChildSchemas', []);

        this.name = 'New content schema';
        this.type = 'content';
    }

    /**
     * Checks whether a tab is the default one
     *
     * @param {String} tabId
     *
     * @returns {Boolean} Is the tab default
     */
    isDefaultTab(tabId) {
        return (!this.defaultTabId && tabId === 'meta') || this.defaultTabId === tabId;
    }
}

module.exports = ContentSchema;
