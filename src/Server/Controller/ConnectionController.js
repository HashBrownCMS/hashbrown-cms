'use strict';

/**
 * The Controller for Connections
 *
 * @memberof HashBrown.Server.Controller
 */
class ConnectionController extends HashBrown.Controller.ResourceController {
    static get category() { return 'connections'; }
    
    /**
     * Routes
     */
    static get routes() {
        return {
            ...super.routes,
            '/api/${project}/${environment}/connections/deployers': {
                handler: this.deployers,
                user: {
                    scope: 'connections'
                }
            },
            '/api/${project}/${environment}/connections/processors': {
                handler: this.processors,
                user: {
                    scope: 'connections'
                }
            }
        };
    }        
    
    /**
     * @example GET /api/${project}/${environment}/connections/deployers
     */
    static async deployers(request, params, body, query, user) {
        let deployers = {};

        for(let name in HashBrown.Entity.Deployer) {
            let deployer = HashBrown.Entity.Deployer[name];

            if(deployer === HashBrown.Entity.Deployer.DeployerBase) { continue; }

            deployers[deployer.alias] = deployer.title;
        }

        return new HttpResponse(deployers);
    }
    
    /**
     * @example GET /api/${project}/${environment}/connections/processors
     */
    static processors(request, params, body, query, user) {
        let processors = {};

        for(let name in HashBrown.Entity.Processor) {
            let processor = HashBrown.Entity.Processor[name];

            if(processor === HashBrown.Entity.Processor.ProcessorBase) { continue; }

            processors[processor.alias] = processor.title;
        }

        return new HttpResponse(processors);
    }
}

module.exports = ConnectionController;
