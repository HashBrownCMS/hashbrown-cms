'use strict';

/**
 * The Controller for Connections
 *
 * @memberof HashBrown.Server.Controllers
 */
class ConnectionController extends HashBrown.Controllers.ResourceController {
    static get category() { return 'connections'; }
    
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/:project/:environment/connections/deployers', this.middleware(), this.getHandler('deployers'));
        app.get('/api/:project/:environment/connections/processors', this.middleware(), this.getHandler('processors'));
    
        super.init(app);
    }        
    
    /**
     * @example GET /api/:project/:environment/connections/deployers
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Array} Deployers
     */
    static async deployers(req, res) {
        let deployers = [];

        for(let deployer of HashBrown.Helpers.ConnectionHelper.deployers) {
            deployers.push({
                alias: deployer.alias,
                name: deployer.name
            });
        }

        return deployers;
    }
    
    /**
     * @example GET /api/:project/:environment/connections/processors
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Array} Processors
     */
    static processors(req, res) {
        let processors = [];

        for(let processor of HashBrown.Helpers.ConnectionHelper.processors) {
            processors.push({
                alias: processor.alias,
                name: processor.name
            });
        }

        return processors;
    }
    
    /**
     * @example GET /api/:project/:environment/connections
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Array} Connections
     */
    static async getAll(req, res) {
        return await HashBrown.Helpers.ConnectionHelper.getAllConnections(req.project, req.environment);
    }

    /**
     * @example POST /api/:project/:environment/connections/:id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Connection} Connection
     */
    static async set(req, res) {
        let id = req.params.id;
        let connection = req.body;
        let shouldCreate = req.query.create == 'true' || req.query.create == true;

        await HashBrown.Helpers.ConnectionHelper.setConnectionById(req.project, req.environment, id, new HashBrown.Models.Connection(connection), shouldCreate);
    }
    
    /**
     * @example POST /api/:project/:environment/connections/pull/:id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {String} Connection id
     */
    static async pull(req, res) {
        let id = req.params.id;

        let resourceItem = await HashBrown.Helpers.SyncHelper.getResourceItem(req.project, req.environment, 'connections', id);

        if(!resourceItem) { throw new Error('Couldn\'t find remote Connection "' + id + '"'); }
        
        await HashBrown.Helpers.ConnectionHelper.setConnectionById(req.project, req.environment, id, new HashBrown.Models.Connection(resourceItem), true);
    }
    
    /**
     * @example POST /api/:project/:environment/connections/push/:id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {String} Connection id
     */
    static async push(req, res) {
        let id = req.params.id;

        let localConnection = await HashBrown.Helpers.ConnectionHelper.getConnectionById(req.project, req.environment, id);
            
        await HashBrown.Helpers.SyncHelper.setResourceItem(req.project, req.environment, 'connections', id, localConnection);
    }

    /**
     * @example GET /api/:project/:environment/connections/:id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Connection} Connection
     */
    static async get(req, res) {
        return await HashBrown.Helpers.ConnectionHelper.getConnectionById(req.project, req.environment, req.params.id);
    }

    /**
     * @example POST /api/:project/:environment/connections/new
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Connection} Connection
     */
    static async new(req, res) {
        return await HashBrown.Helpers.ConnectionHelper.createConnection(req.project, req.environment);
    }

    /**
     * @example DELETE /api/:project/:environment/connections/:id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Connection} Connection
     */
    static async remove(req, res) {
        await HashBrown.Helpers.ConnectionHelper.removeConnectionById(req.project, req.environment, id);
    }
}

module.exports = ConnectionController;
