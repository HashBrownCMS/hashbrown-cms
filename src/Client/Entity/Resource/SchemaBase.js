'use strict';

/**
 * The schema base class
 *
 * @memberof HashBrown.Client.Entity.Resource
 */
class SchemaBase extends require('Common/Entity/Resource/SchemaBase') {
    /**
     * Gets a list of instances of this entity type
     *
     * @param {Object} options
     *
     * @return {Array} Instances
     */
    static async list(options = {}) {
        if(this.type) {
            options.type = this.type;
        }

        return await super.list(options);
    }
}

module.exports = SchemaBase;
