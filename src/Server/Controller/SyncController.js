'use strict';

/**
 * The controller for sync
 *
 * @memberof HashBrown.Server.Controller
 */
class SyncController extends HashBrown.Controller.ControllerBase {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.post('/api/:project/sync/login', this.middleware({setProject: false, needsAdmin: true}), this.postLogin);
    }

    /**
     * Logs in a user remotely
     */
    static async postLogin(req, res) {
        try {
            let token = await HashBrown.Service.SyncService.renewToken(req.params.project, req.body.username, req.body.password, req.body.url);
            
            res.status(200).send(token);
        
        } catch(e) {
            res.status(401).send(SyncController.printError(e));
        
        }
    }
}

module.exports = SyncController;
