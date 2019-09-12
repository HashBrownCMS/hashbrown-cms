'use strict';

/**
 * The base class for all Schema types
 *
 * @memberof HashBrown.Common.Entity.Resource.Schema
 */
class SchemaBase extends HashBrown.Entity.Resource.ResourceBase {
    static get category() { return 'schemas'; }
    
    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(String, 'name');
        this.def(String, 'icon');
        this.def(String, 'type');
        this.def(String, 'parentSchemaId');
        this.def(Boolean, 'isLocked');

        // Sync
        this.def(Object, 'sync');

        this.def(Array, 'hiddenProperties', []);
    }

    /**
     * Gets a URL safe name for this schema
     *
     * @return {String} URL safe name
     */
    getUrlSafeName() {
        return this.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
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
    static create(parentSchema) {
        checkParam(parentSchema, 'parentSchema', HashBrown.Entity.Resource.Schema.SchemaBase);

        return HashBrown.Service.SchemaService.getEntity({
            id: Schema.createId(),
            icon: parentSchema.icon || 'file',
            type: parentSchema.type,
            editorId: parentSchema.editorId,
            parentSchemaId: parentSchema.id
        });
    }
}

module.exports = SchemaBase;
