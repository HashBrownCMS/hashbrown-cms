'use strict';

/**
 * The controller for sync
 *
 * @memberof HashBrown.Server.Controllers
 */
class SyncController extends HashBrown.Controllers.ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.post('/api/:project/sync/login', this.middleware({setProject: false, needsAdmin: true}), this.postLogin);
    }

    /**
     * Logs in a user remotely
     */
    static postLogin(req, res) {
        HashBrown.Helpers.SyncHelper.renewToken(req.params.project, req.body.username, req.body.password)
        .then((token) => {
            res.status(200).send(token);
        })
        .catch((e) => {
            res.status(401).send(SyncController.printError(e));
        });
    }
}

module.exports = SyncController;
