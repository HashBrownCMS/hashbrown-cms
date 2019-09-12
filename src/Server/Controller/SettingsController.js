'use strict';

/**
 * The controller for settings
 *
 * @memberof HashBrown.Server.Controller
 */
class SettingsController extends HashBrown.Controller.ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/:project/environments', this.middleware({setProject: false}), this.getEnvironments);

        app.get('/api/:project/settings', this.middleware({setProject: false}), this.getSettings);
        app.get('/api/:project/settings/:section', this.middleware(), this.getSettings);
        app.get('/api/:project/:environment/settings', this.middleware(), this.getSettings);
        app.get('/api/:project/:environment/settings/:section', this.middleware(), this.getSettings);
        
        app.post('/api/:project/settings', this.middleware({needsAdmin: true}), this.setSettings);
        app.post('/api/:project/settings/:section', this.middleware({needsAdmin: true}), this.setSettings);
        app.post('/api/:project/:environment/settings', this.middleware({scope: 'settings'}), this.setSettings);
        app.post('/api/:project/:environment/settings/:section', this.middleware({scope: 'settings'}), this.setSettings);
    }
    
    /**
     * Get environments
     */
    static getEnvironments(req, res) {
        HashBrown.Service.ProjectService.getAllEnvironments(req.params.project)
        .then((environments) => {
            res.status(200).send(environments);
        })
        .catch((e) => {
            res.status(502).send(SettingsController.printError(e));
        });
    }

    /**
     * Get settings object
     */
    static getSettings(req, res) {
        HashBrown.Service.SettingsService.getSettings(req.params.project, req.params.environment, req.params.section)
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

        HashBrown.Service.SettingsService.setSettings(req.params.project, req.params.environment, req.params.section, settings)
        .then(() => {
            res.status(200).send(settings);
        })
        .catch((e) => {
            res.status(502).send(SettingsController.printError(e));
        });
    }
}

module.exports = SettingsController;
