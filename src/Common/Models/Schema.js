'use strict';

let Entity = require('./Entity');

/**
 * The base class for all Schema types
 *
 * @memberof HashBrown.Common.Models
 */
class Schema extends Entity {
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
        params = params || {}

        // Convert from old sync variables
        params.sync = params.sync || {};

        if(typeof params.local !== 'undefined') {
            params.sync.isLocal = params.local;
            delete params.local;
        }

        if(typeof params.remote !== 'undefined') {
            params.sync.isRemote = params.remote;
            delete params.remote;
        }

        // Convert from old "locked" state
        if(typeof params.locked !== 'undefined') {
            params.isLocked = params.locked;
            delete params.locked;
        }

        return params;
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
