'use strict';

let ApiController = require('./ApiController');

class SettingsController extends ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/:project/settings/:section', this.middleware(), this.getSettings);
        app.get('/api/:project/:environment/settings/:section', this.middleware(), this.getSettings);
        
        app.post('/api/:project/settings/:section', this.middleware({scope: 'settings'}), this.setSettings);
        app.post('/api/:project/:environment/settings/:section', this.middleware({scope: 'settings'}), this.setSettings);
    }
    
    /**
     * Get settings object
     */
    static getSettings(req, res) {
        SettingsHelper.getSettings(req.project, req.environment, req.params.section)
        .then((settings) => {
            res.status(200).send(settings);
        })
        .catch((e) => {
            res.status(502).send(SettingsController.printError(e));
        });
    }
    
    /**
     * Set settings object
     */
    static setSettings(req, res) {
        let settings = req.body;

        SettingsHelper.setSettings(req.project, req.environment, req.params.section, settings)
        .then(() => {
            res.status(200).send(settings);
        })
        .catch((e) => {
            res.status(502).send(SettingsController.printError(e));
        });
    }
}

module.exports = SettingsController;
