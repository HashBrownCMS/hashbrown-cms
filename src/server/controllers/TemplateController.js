'use strict';

let ApiController = require('./ApiController');

class TemplateController extends ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/:project/:environment/templates', this.middleware(), this.getTemplates)
        app.get('/api/:project/:environment/sectionTemplates', this.middleware(), this.getSectionTemplates)
    }
    
    /**
     * Gets an array of all templates
     */
    static getTemplates(req, res) {
        ConnectionHelper.getTemplateProvider()
        .then((connection) => {
            connection.getTemplates()
            .then((templates) => {
                res.status(200).send(templates);
            })
            .catch((e) => {
                debug.log(e, ApiController)
                res.status(404).send([]);
            });            
        })
        .catch((e) => {
            debug.log(e, ApiController)
            res.status(404).send([]);
        });            
    }
    
    /**
     * Gets an array of all section templates
     */
    static getSectionTemplates(req, res) {
        ConnectionHelper.getTemplateProvider()
        .then((connection) => {
            connection.getSectionTemplates()
            .then((templates) => {
                res.status(200).send(templates);
            })
            .catch((e) => {
                debug.log(e, ApiController)
                res.status(404).send([]);
            });            
        })
        .catch((e) => {
            debug.log(e, ApiController)
            res.status(404).send([]);
        });            
    }
}

module.exports = TemplateController;
