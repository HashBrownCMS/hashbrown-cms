'use strict';

/**
 * The Controller for Connections
 *
 * @memberof HashBrown.Server.Controllers
 */
class ConnectionController extends require('./ApiController') {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/:project/:environment/connections', this.middleware(), this.getConnections);
        app.get('/api/:project/:environment/connections/deployers', this.middleware(), this.getDeployers);
        app.get('/api/:project/:environment/connections/processors', this.middleware(), this.getProcessors);
        app.get('/api/:project/:environment/connections/:id', this.middleware(), this.getConnection);
        
        app.post('/api/:project/:environment/connections/new', this.middleware({scope: 'connections'}), this.createConnection);
        app.post('/api/:project/:environment/connections/pull/:id', this.middleware({scope: 'connections'}), this.pullConnection);
        app.post('/api/:project/:environment/connections/push/:id', this.middleware({scope: 'connections'}), this.pushConnection);
        app.post('/api/:project/:environment/connections/:id', this.middleware({scope: 'connections'}), this.postConnection);
        
        app.delete('/api/:project/:environment/connections/:id', this.middleware({scope: 'connections'}), this.deleteConnection);
    }        
    
    /**
     * @example GET /api/:project/:environment/connections/deployers
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Array} Deployers
     */
    static getDeployers(req, res) {
        let deployers = [];

        for(let deployer of HashBrown.Helpers.ConnectionHelper.deployers) {
            deployers.push({
                alias: deployer.alias,
                name: deployer.name
            });
        }

        res.send(deployers);
    }
    
    /**
     * @example GET /api/:project/:environment/connections/processors
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Array} Processors
     */
    static getProcessors(req, res) {
        let processors = [];

        for(let processor of HashBrown.Helpers.ConnectionHelper.processors) {
            processors.push({
                alias: processor.alias,
                name: processor.name
            });
        }

        res.send(processors);
    }
    
    /**
     * @example GET /api/:project/:environment/connections
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Array} Connections
     */
    static getConnections(req, res) {
        HashBrown.Helpers.ConnectionHelper.getAllConnections(req.project, req.environment)
        .then((connections) => {
            res.send(connections);
        })
        .catch((e) => {
            res.status(502).send(ConnectionController.printError(e));
        });
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
    static postConnection(req, res) {
        let id = req.params.id;
        let connection = req.body;

        HashBrown.Helpers.ConnectionHelper.setConnectionById(req.project, req.environment, id, new HashBrown.Models.Connection(connection))
        .then(() => {
            res.status(200).send(connection);
        })
        .catch((e) => {
            res.status(502).send(ConnectionController.printError(e));
        });
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
    static pullConnection(req, res) {
        let id = req.params.id;

        HashBrown.Helpers.SyncHelper.getResourceItem(req.project, req.environment, 'connections', id)
        .then((resourceItem) => {
            if(!resourceItem) { return Promise.reject(new Error('Couldn\'t find remote Connection "' + id + '"')); }
        
            return HashBrown.Helpers.ConnectionHelper.setConnectionById(req.project, req.environment, id, new HashBrown.Models.Connection(resourceItem), true)
            .then((newConnection) => {
                res.status(200).send(id);
            });
        })
        .catch((e) => {
            res.status(404).send(ConnectionController.printError(e));   
        }); 
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
    static pushConnection(req, res) {
        let id = req.params.id;

        HashBrown.Helpers.ConnectionHelper.getConnectionById(req.project, req.environment, id)
        .then((localConnection) => {
            return HashBrown.Helpers.SyncHelper.setResourceItem(req.project, req.environment, 'connections', id, localConnection);
        })
        .then(() => {
            res.status(200).send(id);
        })
        .catch((e) => {
            res.status(404).send(ConnectionController.printError(e));   
        }); 
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
    static getConnection(req, res) {
        let id = req.params.id;
   
        if(id && id != 'undefined') {
            HashBrown.Helpers.ConnectionHelper.getConnectionById(req.project, req.environment, id)
            .then((connection) => {
                res.send(connection);
            })
            .catch((e) => {
                res.status(502).send(ConnectionController.printError(e));
            });
        
        } else {
            res.status(400).send('Connection id is not provided');
        
        }
    }
    
    /**
     * @example POST /api/:project/:environment/connections/new
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Connection} Connection
     */
    static createConnection(req, res) {
        HashBrown.Helpers.ConnectionHelper.createConnection(req.project, req.environment)
        .then((connection) => {
            res.status(200).send(connection);
        })
        .catch((e) => {
            res.status(502).send(ConnectionController.printError(e));
        });
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
    static deleteConnection(req, res) {
        let id = req.params.id;
        
        HashBrown.Helpers.ConnectionHelper.removeConnectionById(req.project, req.environment, id)
        .then(() => {
            res.status(200).send(id);
        })
        .catch((e) => {
            res.status(502).send(ConnectionController.printError(e));
        });
    }
}

module.exports = ConnectionController;
