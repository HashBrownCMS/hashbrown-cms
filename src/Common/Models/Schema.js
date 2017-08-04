'use strict';

const Resource = require('./Resource');

/**
 * The base class for all Schema types
 *
 * @memberof HashBrown.Common.Models
 */
class Schema extends Resource {
    constructor(params) {
        super(Schema.paramsCheck(params));
    }
    
    structure() {
        this.def(String, 'id');
        this.def(String, 'name');
        this.def(String, 'icon');
        this.def(String, 'parentSchemaId');
        this.def(Boolean, 'isLocked');

        // Sync
        this.def(Object, 'sync');

        this.def(Array, 'hiddenProperties', []);
    }
    
    /**
     * Checks the format of the params
     *
     * @params {Object} params
     *
     * @returns {Object} Params
     */
    static paramsCheck(params) {
        return super.paramsCheck(params);
    }

    /**
     * Checks whether a property is hidden
     *
     * @param {String} name
     *
     * @returns {Boolean} Is hidden
     */
    isPropertyHidden(name) {
        return this.hiddenProperties.indexOf(name) > -1;
    }

    /**
     * Creates a new schema
     *
     * @param {Schema} parentSchema
     *
     * @returns {Schema} schema
     */
    static create(
        parentSchema = requiredParam('parentSchema')
    ) {
        return HashBrown.Helpers.SchemaHelper.getModel({
            id: Schema.createId(),
            icon: parentSchema.icon || 'file',
            type: parentSchema.type,
            editorId: parentSchema.editorId,
            parentSchemaId: parentSchema.id
        });
    }
}

module.exports = Schema;
