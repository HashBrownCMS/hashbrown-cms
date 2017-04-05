'use strict';

let Entity = require('./Entity');

/**
 * The base class for all Schema types
 */
class Schema extends Entity {
    structure() {
        this.def(Boolean, 'locked');
        this.def(Boolean, 'local');
        this.def(Boolean, 'remote');
        this.def(String, 'id');
        this.def(String, 'name');
        this.def(String, 'icon');
        this.def(String, 'parentSchemaId');
    }

    /**
     * Creates a new schema
     *
     * @param {Schema} parentSchema
     *
     * @returns {Schema} schema
     */
    static create(parentSchema) {
        return SchemaHelper.getModel({
            id: Entity.createId(),
            icon: 'file',
            type: parentSchema.type,
            parentSchemaId: parentSchema.id
        });
    }
}

module.exports = Schema;
