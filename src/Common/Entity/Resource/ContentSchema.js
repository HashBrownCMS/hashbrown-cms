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
     * Adopts values into this entity
     *
     * @param {Object} params
     */
    adopt(params = {}) {
        checkParam(params, 'params', Object);

        params = params || {};
        params.config = params.config || {};

        // Adopt from old structure using "fields -> properties"
        if(params.fields) {
            let properties = params.fields.properties || {};
            delete params.fields.properties;

            for(let k in params.fields) {
                params.config[k] = params.fields[k];
            }
            
            for(let k in properties) {
                params.config[k] = properties[k];
            }
            
            delete params.fields;
        }
        
        // Adopt uischema.org fields
        if(params['@type']) {
            let i18n = params['@i18n'] && params['@i18n']['en'] ? params['@i18n']['en'] : {};

            params.id = params['@type'];
            params.name = i18n['@name'];
            params.parentId = params['@parent'] || 'contentBase';
            
            for(let key in params['@config'] || {}) {
                params[key] = params['@config'][key];
            }

            let config = {};
            
            for(let key in params) {
                if(
                    key[0] === '@' ||
                    typeof this[key] !== 'undefined'
                ) { continue; }

                config[key] = this.constructor.getFieldFromUISchema(key, params[key], i18n[key]);
            }

            params.config = config;
        }

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
