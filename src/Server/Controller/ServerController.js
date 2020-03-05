'use strict';

const Path = require('path');

/**
 * The controller for dashboard related operations
 *
 * @memberof HashBrown.Server.Controller
 */
class ServerController extends HashBrown.Controller.ControllerBase {
    /**
     * Routes
     */
    static get routes() {
        return {
            '/api/server/update/check': {
                handler: this.updateCheck,
                user: true
            }
        }
    }
        
    /**
     * Checks for new updates
     */
    static async updateCheck(req, res) {
        let status = await HashBrown.Service.UpdateService.check();

        return new HttpResponse(status);
    }
}

module.exports = ServerController;
