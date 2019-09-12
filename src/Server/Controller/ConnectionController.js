'use strict';

/**
 * The Controller for Connections
 *
 * @memberof HashBrown.Server.Controller
 */
class ConnectionController extends HashBrown.Controller.ResourceController {
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
     * @returns {Object} Deployers
     */
    static async deployers(req, res) {
        let deployers = {};

        for(let name in HashBrown.Entity.Deployer) {
            let deployer = HashBrown.Entity.Deployer[name];

            if(deployer === HashBrown.Entity.Deployer.DeployerBase) { continue; }

            deployers[deployer.alias] = deployer.title;
        }

        return deployers;
    }
    
    /**
     * @example GET /api/:project/:environment/connections/processors
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Object} Processors
     */
    static processors(req, res) {
        let processors = {};

        for(let name in HashBrown.Entity.Processor) {
            let processor = HashBrown.Entity.Processor[name];

            if(processor === HashBrown.Entity.Processor.ProcessorBase) { continue; }

            processors[processor.alias] = processor.title;
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
        return await HashBrown.Service.ConnectionService.getAllConnections(req.project, req.environment);
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

        return await HashBrown.Service.ConnectionService.setConnectionById(req.project, req.environment, id, new HashBrown.Entity.Resource.Connection(connection), shouldCreate);
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

        let resourceItem = await HashBrown.Service.SyncService.getResourceItem(req.project, req.environment, 'connections', id);

        if(!resourceItem) { throw new Error('Couldn\'t find remote Connection "' + id + '"'); }
        
        await HashBrown.Service.ConnectionService.setConnectionById(req.project, req.environment, id, new HashBrown.Entity.Resource.Connection(resourceItem), true);
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

        let localConnection = await HashBrown.Service.ConnectionService.getConnectionById(req.project, req.environment, id);
            
        await HashBrown.Service.SyncService.setResourceItem(req.project, req.environment, 'connections', id, localConnection);
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
        return await HashBrown.Service.ConnectionService.getConnectionById(req.project, req.environment, req.params.id);
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
        return await HashBrown.Service.ConnectionService.createConnection(req.project, req.environment);
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
        let id = req.params.id;
        
        await HashBrown.Service.ConnectionService.removeConnectionById(req.project, req.environment, id);

        return 'Connection with id "' + id + '" deleted successfully';
    }
}

module.exports = ConnectionController;
