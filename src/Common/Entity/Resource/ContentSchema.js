'use strict';

/**
 * Schema for content nodes
 *
 * @memberof HashBrown.Common.Entity.Resource
 */
class ContentSchema extends HashBrown.Entity.Resource.SchemaBase {
    static get type() { return 'content'; }
    
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
     * Instantiates a resource
     *
     * @param {Object} params
     *
     * @return {HashBrown.Entity.Resource.ContentSchema} Instance
     */
    static new(params = {}) {
        checkParam(params, 'params', Object)

        params = params || {};
    
        return new this(params);
    }
   
    /**
     * Adopts values into this entity
     *
     * @param {Object} params
     */
    adopt(params = {}) {
        checkParam(params, 'params', Object);

        params = params || {};
        
        if(!params.fields) { params.fields = {}; }
        if(!params.fields.properties) { params.fields.properties = {}; }

        super.adopt(params);
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
