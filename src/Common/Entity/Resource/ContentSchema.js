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
     * Checks whether a tab is the default one
     *
     * @param {String} tabId
     *
     * @returns {Boolean} Is the tab default
     */
    isDefaultTab(tabId) {
        return (!this.defaultTabId && tabId === 'meta') || this.defaultTabId === tabId;
    }
        
    /**
     * Merges two sets of schema data
     *
     * @param {HashBrown.Entity.Resource.SchemaBase} parentSchema
     */
    merge(parentSchema) {
        super.merge(parentSchema);

        // Merge tabs
        if(!this.tabs) { this.tabs = {}; }
        if(!parentSchema.tabs) { parentSchema.tabs = {}; }
       
        for(let k in parentSchema.tabs) {
            if(this.tabs[k]) { continue; }

            this.tabs[k] = parentSchema.tabs[k];
        }

        // Set default tab id
        this.defaultTabId = this.defaultTabId || parentSchema.defaultTabId;
    }
}

module.exports = ContentSchema;
