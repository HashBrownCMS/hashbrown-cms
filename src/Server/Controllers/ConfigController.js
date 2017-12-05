'use strict';

/**
 * The Controller for configuration
 *
 * @memberof HashBrown.Server.Controllers
 */
class ConfigController extends require('./ApiController') {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/config/:section', this.middleware({needsAdmin: true}), this.getConfig);
        
        app.post('/api/config/:section', this.middleware({needsAdmin: true}), this.postConfig);
    }        
    
    /**
     * @example GET /api/config/:section
     *
     * @param {String} section
     *
     * @returns {Object} Section
     */
    static getConfig(req, res) {
        HashBrown.Helpers.ConfigHelper.get(req.params.section)
        .then((section) => {
            res.status(200).send(section);
        })
        .catch((e) => {
            res.status(502).send(ConfigController.printError(e));
        });
    }
    
    /**
     * @example POST /api/config/:section
     *
     * @param {String} section
     * @param {Object} config JSON body
     */
    static postConfig(req, res) {
        HashBrown.Helpers.ConfigHelper.set(req.params.section, req.body)
        .then(() => {
            res.status(200).send('OK');
        })
        .catch((e) => {
            res.status(502).send(ConfigController.printError(e));
        });
    }
}

module.exports = ConfigController;
