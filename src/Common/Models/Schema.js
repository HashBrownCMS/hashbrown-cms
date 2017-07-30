'use strict';

let Entity = require('./Entity');

/**
 * The base class for all Schema types
 *
 * @memberof HashBrown.Common.Models
 */
class Schema extends Entity {
    constructor(properties) {
        super(properties);
    }
    
    structure() {
        this.def(Boolean, 'locked');
        this.def(Boolean, 'local');
        this.def(Boolean, 'remote');
        this.def(String, 'id');
        this.def(String, 'name');
        this.def(String, 'icon');
        this.def(String, 'parentSchemaId');
        this.def(Array, 'hiddenProperties', []);
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
            id: Entity.createId(),
            icon: parentSchema.icon || 'file',
            type: parentSchema.type,
            editorId: parentSchema.editorId,
            parentSchemaId: parentSchema.id
        });
    }
}

module.exports = Schema;
