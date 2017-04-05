'use strict';

// Classes
let ApiController = require('./ApiController');

class SyncController extends ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.post('/api/:project/:environment/sync/login', this.middleware({scope: 'settings'}), this.postLogin);
    }

    /**
     * Logs in a user remotely
     */
    static postLogin(req, res) {
        SyncHelper.renewToken(req.project, req.environment, req.body.username, req.body.password)
        .then((token) => {
            res.status(200).send(token);
        })
        .catch((e) => {
            res.status(402).send(SyncController.printError(e));
        });
    }
}

module.exports = SyncController;
