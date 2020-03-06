'use strict';

/**
 * Schema for content nodes
 *
 * @memberof HashBrown.Common.Entity.Resource.Schema
 */
class ContentSchema extends HashBrown.Entity.Resource.Schema.SchemaBase {
    constructor(properties) {
        super(ContentSchema.paramsCheck(properties));
    }
    
    structure() {
        super.structure();

        this.def(String, 'defaultTabId');
        this.def(Object, 'tabs', {});
        this.def(Object, 'fields', { properties: {} });
        this.def(Boolean, 'allowedAtRoot', true);
        this.def(Array, 'allowedChildSchemas', []);

        this.name = 'New content schema';
    }
   
    /**
     * Gets the type as a string
     *
     * @return {String} Type
     */
    get type() {
        return 'content';
    }

    /**
     * Checks the format of the params
     *
     * @params {Object} params
     *
     * @returns {Object} Params
     */
    static paramsCheck(params) {
        if(!params.fields) { params.fields = {}; }
        if(!params.fields.properties) { params.fields.properties = {}; }

        return super.paramsCheck(params);
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
