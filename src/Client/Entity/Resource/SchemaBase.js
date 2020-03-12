'use strict';

/**
 * The schema base class
 *
 * @memberof HashBrown.Client.Entity.Resource
 */
class SchemaBase extends require('Common/Entity/Resource/SchemaBase') {
    /**
     * Gets an instance of this entity type
     *
     * @param {String} id
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.SchemaBase} Instance
     */
    static async get(id, options = {}) {
        checkParam(id, 'id', String);

        if(!id) { return null; }

        let resource = await super.get(id);
       
        if(!resource) { return null; }

        // Get parent fields, if specified
        if(options.withParentFields && resource.parentId) {
            let parent = await this.get(resource.parentId, options);
            
            resource = this.merge(resource, parent);
        }
        
        return resource;
    }
}

module.exports = SchemaBase;
