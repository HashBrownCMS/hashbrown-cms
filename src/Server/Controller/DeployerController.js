'use strict';

/**
 * The controller for deployers
 *
 * @memberof HashBrown.Server.Controller
 */
class DeployerController extends HashBrown.Controller.ControllerBase {
    /**
     * Routes
     */
    static get routes() {
        return {
            '/api/deployers': {
                handler: this.deployers,
                user: true
            }
        };
    }        
    
    /**
     * @example GET /api/deployers
     */
    static async deployers(request, params, body, query, user) {
        let deployers = [];

        for(let name in HashBrown.Entity.Deployer) {
            let deployer = HashBrown.Entity.Deployer[name];

            if(deployer === HashBrown.Entity.Deployer.DeployerBase) { continue; }

            deployers.push(deployer.alias);
        }

        return new HttpResponse(deployers);
    }
}

module.exports = DeployerController;
