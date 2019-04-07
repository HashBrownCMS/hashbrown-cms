'use strict';

/**
 * The Controller for Schemas
 *
 * @memberof HashBrown.Server.Controllers
 */
class SchemaController extends HashBrown.Controllers.ResourceController {
    static get category() { return 'schemas'; }
    
    /**
     * @example GET /api/:project/:environment/schemas
     *
     * @apiGroup Schema
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Array} Schemas
     */
    static async getAll(req, res) {
        if(req.query.customOnly) {
            return await HashBrown.Helpers.SchemaHelper.getCustomSchemas(req.project, req.environment);
        }

        return await HashBrown.Helpers.SchemaHelper.getAllSchemas(req.project, req.environment);
    }
    
    /**
     * @example GET /api/:project/:environment/schemas/:id
     *
     * @apiGroup Schema
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Schema} Schema
     */
    static async get(req, res) {
        return await HashBrown.Helpers.SchemaHelper.getSchemaById(req.project, req.environment, req.params.id)
    }
    
    /**
     * @example POST /api/:project/:environment/schemas/:id
     *
     * @apiGroup Schema
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @param {Schema} schema The Schema model to update
     *
     * @returns {Schema} Schema
     */
    static async set(req, res) {
        let id = req.params.id;
        let schema = HashBrown.Helpers.SchemaHelper.getModel(req.body);
        let shouldCreate = req.query.create == 'true' || req.query.create == true;

        await HashBrown.Helpers.SchemaHelper.setSchemaById(req.project, req.environment, id, schema, shouldCreate);

        return schema;
    }
    
    /**
     * @example POST /api/:project/:environment/schemas/pull/:id
     *
     * @apiGroup Schema
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Schema} The pulled Schema
     */
    static async pull(req, res) {
        let id = req.params.id;
        let resourceItem = await HashBrown.Helpers.SyncHelper.getResourceItem(req.project, req.environment, 'schemas', id)
        
        if(!resourceItem) { throw new Error('Couldn\'t find remote Schema "' + id + '"'); }
    
        await HashBrown.Helpers.SchemaHelper.setSchemaById(req.project, req.environment, id, HashBrown.Helpers.SchemaHelper.getModel(resourceItem), true);

        return resourceItem;
    }
    
    /**
     * @example POST /api/:project/:environment/schemas/push/:id
     *
     * @apiGroup Schema
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Schema} The pushed Schema
     */
    static async push(req, res) {
        let id = req.params.id;

        let localSchema = await HashBrown.Helpers.SchemaHelper.getSchemaById(req.project, req.environment, id);

        await HashBrown.Helpers.SyncHelper.setResourceItem(req.project, req.environment, 'schemas', id, localSchema);
       
        return id;
    }
    
    /**
     * @example POST /api/:project/:environment/schemas/new
     *
     * @apiGroup Schema
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Schema} The created Schema
     */
    static async new(req, res) {
        return await HashBrown.Helpers.SchemaHelper.createSchema(req.project, req.environment, req.query.parentSchemaId);
    }
    
    /**
     * @example DELETE /api/:project/:environment/schemas/:id
     *
     * @apiGroup Schema
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     */
    static async remove(req, res) {
        let id = req.params.id;
        
        await HashBrown.Helpers.SchemaHelper.removeSchemaById(req.project, req.environment, id);

        return 'Schema with id "' + id + '" deleted successfully';
    }
}

module.exports = SchemaController;
