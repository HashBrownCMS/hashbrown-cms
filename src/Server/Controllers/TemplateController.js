'use strict';

/**
 * The controller fro templates
 *
 * @memberof HashBrown.Server.Controllers
 */
class TemplateController extends require('./ApiController') {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/:project/:environment/templates', this.middleware(), this.getTemplates);
        app.get('/api/:project/:environment/templates/:type/:name', this.middleware(), this.getTemplate);
        
        app.post('/api/:project/:environment/templates/:type/:name', this.middleware(), this.postTemplate);
        
        app.delete('/api/:project/:environment/templates/:type/:name', this.middleware(), this.deleteTemplate);
    }
    
    /**
     * Posts a Template by name
     */
    static postTemplate(req, res) {
        let type = req.params.type;
        let name = req.params.name;
        let oldName = req.query.oldName;
        let template = req.body;
        let connection;
       
        // Get template provider
        HashBrown.Helpers.ConnectionHelper.getTemplateProvider(req.project, req.environment)
        .then((provider) => {
            connection = provider;

            if(!connection) { return Promise.reject(new Error('No template provider found')); }

            // If an old name was specified, get the markup first
            if(oldName) {
                return connection.getTemplate(type, oldName)
                .then((oldTemplate) => {
                    template.markup = oldTemplate.markup;    
                });
            }

            return Promise.resolve();
        })
        .then(() => {
            // Set new template
            return connection.setTemplate(type, name, template.markup);
        })
        .then(() => {
            // If an old name was specified, remove it
            if(oldName) {
                return connection.removeTemplate(type, oldName);
            }

            return Promise.resolve();
        })
        .then(() => {
            res.status(200).send('OK');
        })
        .catch((e) => {
            res.status(404).send(TemplateController.printError(e, false));
        });            
    }
    
    /**
     * Deletes a Template by name
     */
    static deleteTemplate(req, res) {
        let type = req.params.type;
        let name = req.params.name;

        HashBrown.Helpers.ConnectionHelper.getTemplateProvider(req.project, req.environment)
        .then((connection) => {
            if(!connection) { return Promise.reject(new Error('No template provider found')); }
            
            return connection.removeTemplate(type, name);
        })
        .then(() => {
            res.status(200).send('OK');
        })
        .catch((e) => {
            res.status(404).send(TemplateController.printError(e, false));
        });            
    }


    /**
     * Gets a Template by name
     */
    static getTemplate(req, res) {
        let type = req.params.type;
        let name = req.params.name;

        HashBrown.Helpers.ConnectionHelper.getTemplateProvider(req.project, req.environment)
        .then((connection) => {
            if(!connection) { return Promise.reject(new Error('No template provider found')); }
            
            return connection.getTemplate(type, name);
        })
        .then((template) => {
            res.status(200).send(template);
        })
        .catch((e) => {
            res.status(404).send(TemplateController.printError(e, false));
        });            
    }

    /**
     * Gets an array of all templates
     */
    static getTemplates(req, res) {
        let allTemplates = [];
        let provider;
        
        return HashBrown.Helpers.ConnectionHelper.getTemplateProvider(req.project, req.environment)
        .then((connection) => {
            if(!connection) { return Promise.reject(new Error('No template provider found')); }

            provider = connection;

            return provider.getAllTemplates('page');
        })
        .then((pageTemplates) => {
            if(Array.isArray(pageTemplates)) {
                allTemplates = allTemplates.concat(pageTemplates);
            }

            return provider.getAllTemplates('partial');
        })
        .then((partialTemplates) => {
            if(Array.isArray(partialTemplates)) {
                allTemplates = allTemplates.concat(partialTemplates);
            }

            return Promise.resolve();
        })
        .then(() => {
            res.status(200).send(allTemplates);
        })
        .catch((e) => {
            res.status(404).send(TemplateController.printError(e, false));
        });            
    }
}

module.exports = TemplateController;
