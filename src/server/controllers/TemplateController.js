'use strict';

let ApiController = require('./ApiController');

class TemplateController extends ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/:project/:environment/templates', this.middleware(), this.getTemplates)
        app.get('/api/:project/:environment/templates/:type/:id', this.middleware(), this.getTemplate)
        
        app.post('/api/:project/:environment/templates/:type/:id', this.middleware(), this.postTemplate)
        
        app.delete('/api/:project/:environment/templates/:type/:id', this.middleware(), this.deleteTemplate)
    }
    
    /**
     * Posts a Template by id
     */
    static postTemplate(req, res) {
        let type = req.params.type;
        let id = req.params.id;
        let template = req.body;

        ConnectionHelper.getTemplateProvider(req.project, req.environment)
        .then((connection) => {
            if(!connection) { return Promise.reject(new Error('No template provider found')); }
            
            return connection.setTemplateById(type, id, template);
        })
        .then(() => {
            res.status(200).send('OK');
        })
        .catch((e) => {
            res.status(404).send(ApiController.printError(e, false));
        });            
    }
    
    /**
     * Deletes a Template by id
     */
    static deleteTemplate(req, res) {
        let type = req.params.type;
        let id = req.params.id;

        ConnectionHelper.getTemplateProvider(req.project, req.environment)
        .then((connection) => {
            if(!connection) { return Promise.reject(new Error('No template provider found')); }
            
            return connection.deleteTemplateById(type, id);
        })
        .then(() => {
            res.status(200).send('OK');
        })
        .catch((e) => {
            res.status(404).send(ApiController.printError(e, false));
        });            
    }


    /**
     * Gets a Template by id
     */
    static getTemplate(req, res) {
        let type = req.params.type;
        let id = req.params.id;

        ConnectionHelper.getTemplateProvider(req.project, req.environment)
        .then((connection) => {
            if(!connection) { return Promise.reject(new Error('No template provider found')); }
            
            return connection.getTemplateById(type, id);
        })
        .then((template) => {
            res.status(200).send(template);
        })
        .catch((e) => {
            res.status(404).send(ApiController.printError(e, false));
        });            
    }

    /**
     * Gets an array of all templates
     */
    static getTemplates(req, res) {
        ConnectionHelper.getTemplateProvider(req.project, req.environment)
        .then((connection) => {
            if(!connection) { return Promise.reject(new Error('No template provider found')); }
           
            let allTemplates = [];

            return connection.getTemplates('page')
            .then((pageTemplates) => {
                if(Array.isArray(pageTemplates)) {
                    allTemplates = allTemplates.concat(pageTemplates);
                }

                return connection.getTemplates('partial');
            })
            .catch((e) => {
                debug.log(e.message, TemplateController);
            })
            .then((partialTemplates) => {
                if(Array.isArray(partialTemplates)) {
                    allTemplates = allTemplates.concat(partialTemplates);
                }

                return Promise.resolve();
            })
            .catch((e) => {
                debug.log(e.message, TemplateController);
            })
            .then(() => {
                return Promise.resolve(allTemplates);
            });
        })
        .then((allTemplates) => {
            res.status(200).send(allTemplates);
        })
        .catch((e) => {
            res.status(404).send(ApiController.printError(e, false));
        });            
    }
}

module.exports = TemplateController;
