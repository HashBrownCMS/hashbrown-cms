'use strict';

const Url = require('url');

/**
 * The controller for schema
 *
 * @memberof HashBrown.Server.Controller
 */
class SchemaController extends HashBrown.Controller.ResourceController {
    static get category() { return 'schemas'; }

    /**
     * Initialises this controller
     */
    static init(app) {
        app.post('/api/:project/:environment/schemas/import', this.middleware(), this.getHandler('import'));

        super.init(app);
    }

    /**
     * @example POST /api/:project/:environment/import
     *
     * @apiGroup Schema
     *
     * @param {String} project
     * @param {String} environment
     */
    static async import(req, res) {
        if(!req.query.url) { throw new Error('URL was not provided'); }

        let url = req.query.url;

        let response = await HashBrown.Service.RequestService.request('get', url);

        if(Array.isArray(response)) {
            // Sort schemas without parents first, to avoid dependency exceptions
            response.sort((a, b) => {
                if(!a['@parent']) { return -1; }     
                if(!b['@parent']) { return 1; }

                return 0;
            });

            for(let json of response) {
                await HashBrown.Service.SchemaService.importSchema(req.project, req.environment, json);
            }
        } else {
            await HashBrown.Service.SchemaService.importSchema(req.project, req.environment, response);
        }

        return response;
    }

    /**
     * @example GET /api/:project/:environment/schema
     *
     * @apiGroup Schema
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Array} All schemas
     */
    static async getAll(req, res) {
        if(req.query.customOnly) {
            return await HashBrown.Service.SchemaService.getCustomSchema(req.project, req.environment);
        }

        return await HashBrown.Service.SchemaService.getAllSchemas(req.project, req.environment);
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
     * @returns {HashBrown.Entity.Resource.SchemaBase} Schema
     */
    static async get(req, res) {
        return await HashBrown.Service.SchemaService.getSchemaById(req.project, req.environment, req.params.id)
    }
    
    /**
     * @example POST /api/:project/:environment/schemas/:id
     *
     * @apiGroup Schema
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {Boolean} create Whether the schema should be created if not found
     *
     * @param {HashBrown.Entity.Resource.SchemaBase} schema The schema model to update
     *
     * @returns {HashBrown.Entity.Resource.SchemaBase} Schema
     */
    static async set(req, res) {
        let id = req.params.id;
        let schema = HashBrown.Service.SchemaService.getEntity(req.body);
        let create = req.query.create == 'true' || req.query.create == true;

        await HashBrown.Service.SchemaService.setSchemaById(req.project, req.environment, id, schema, create);

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
     * @returns {HashBrown.Entity.Resource.SchemaBase} The pulled schema
     */
    static async pull(req, res) {
        let id = req.params.id;
        let resourceItem = await HashBrown.Service.SyncService.getResourceItem(req.project, req.environment, 'schemas', id)
        
        if(!resourceItem) { throw new Error('Couldn\'t find remote schema "' + id + '"'); }
    
        await HashBrown.Service.SchemaService.setSchemaById(req.project, req.environment, id, HashBrown.Service.SchemaService.getEntity(resourceItem), true);

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
     * @returns {HashBrown.Entity.Resource.SchemaBase} The pushed schema
     */
    static async push(req, res) {
        let id = req.params.id;

        let localSchema = await HashBrown.Service.SchemaService.getSchemaById(req.project, req.environment, id);

        await HashBrown.Service.SyncService.setResourceItem(req.project, req.environment, 'schemas', id, localSchema);
       
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
     * @returns {HashBrown.Entity.Resource.SchemaBase} The created schema
     */
    static async new(req, res) {
        return await HashBrown.Service.SchemaService.createSchema(req.project, req.environment, req.query.parentSchemaId);
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
        
        await HashBrown.Service.SchemaService.removeSchemaById(req.project, req.environment, id);

        return 'Schema with id "' + id + '" deleted successfully';
    }
}

module.exports = SchemaController;
