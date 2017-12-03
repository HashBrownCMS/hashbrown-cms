'use strict';

const BodyParser = require('body-parser');

const SUBMISSION_TIMEOUT_MS = 1000;

// Private vars
let lastSubmission = Date.now();
let lastIp = '';

/**
 * The controller for Forms
 *
 * @memberof HashBrown.Server.Controllers
 */
class FormsController extends require('./ApiController') {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/:project/:environment/forms/', this.middleware(), this.getAllForms);
        app.get('/api/:project/:environment/forms/:id', this.middleware(), this.getForm);
        app.get('/api/:project/:environment/forms/:id/entries', this.middleware(), this.getAllEntries);

        app.post('/api/:project/:environment/forms/new', this.middleware(), this.postNew);
        app.post('/api/:project/:environment/forms/:id', this.middleware(), this.postForm);
        app.post('/api/:project/:environment/forms/:id/submit', this.middleware({ authenticate: false, allowCORS: this.checkCORS }), BodyParser.urlencoded({extended: true}), this.postSubmit);
        app.post('/api/:project/:environment/forms/pull/:id', this.middleware(), this.pullForm);
        app.post('/api/:project/:environment/forms/push/:id', this.middleware(), this.pushForm);
        app.post('/api/:project/:environment/forms/clear/:id', this.middleware(), this.postClearAllEntries);

        app.delete('/api/:project/:environment/forms/:id', this.middleware(), this.deleteForm);
        
        // Init spam prevention timer
        lastSubmission = Date.now();
    }
      
    /**
     * Check CORS
     *
     * @returns {Promise} Result
     */
    static checkCORS(req, res) {
        return HashBrown.Helpers.FormHelper.getForm(req.params.project, req.params.environment, req.params.id)
        .then((form) => {
            return Promise.resolve(form.allowedOrigin || '*');
        });
    }

    /**
     * @example GET /api/:project/:environment/forms
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Array} Forms
     */
    static getAllForms(req, res) {
        HashBrown.Helpers.FormHelper.getAllForms(req.project, req.environment)
        .then((forms) => {
            res.status(200).send(forms);
        })
        .catch((e) => {
            res.status(502).send(FormsController.printError(e));
        });
    }
    
    /**
     * @example DELETE /api/:project/:environment/forms/:id
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     */
    static deleteForm(req, res) {
        HashBrown.Helpers.FormHelper.deleteForm(req.project, req.environment, req.params.id)
        .then(() => {
            res.status(200).send('OK');
        })
        .catch((e) => {
            res.status(502).send(FormsController.printError(e));
        });
    }
    
    /**
     * @example POST /api/:project/:environment/forms/pull/:id
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Form} The pulled Form
     */
    static pullForm(req, res) {
        let id = req.params.id;

        HashBrown.Helpers.SyncHelper.getResourceItem(req.project, req.environment, 'forms', id)
        .then((resourceItem) => {
            if(!resourceItem) { return Promise.reject(new Error('Couldn\'t find remote Form "' + id + '"')); }
       
            return HashBrown.Helpers.FormHelper.setForm(req.project, req.environment, id, resourceItem)
            .then(() => {
                res.status(200).send(resourceItem);
            });
        })
        .catch((e) => {
            res.status(404).send(FormController.printError(e));   
        }); 
    }
    
    /**
     * @example POST /api/:project/:environment/forms/push/:id
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Form} The pushed Form id
     */
    static pushForm(req, res) {
        let id = req.params.id;

        HashBrown.Helpers.FormHelper.getForm(req.project, req.environment, id)
        .then((localForm) => {
            return HashBrown.Helpers.SyncHelper.setResourceItem(req.project, req.environment, 'forms', id, localForm);
        })
        .then(() => {
            res.status(200).send(id);
        })
        .catch((e) => {
            res.status(404).send(FormController.printError(e));   
        }); 
    }

    /**
     * @example GET /api/:project/:environment/forms/:id
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Form} Form
     */
    static getForm(req, res) {
        HashBrown.Helpers.FormHelper.getForm(req.project, req.environment, req.params.id)
        .then((form) => {
            res.status(200).send(form.getObject());
        })
        .catch((e) => {
            res.status(502).send(FormsController.printError(e));
        });
    }
    
    /**
     * @example GET /api/:project/:environment/forms/:id/entries
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {String} CSV string
     */
    static getAllEntries(req, res) {
        HashBrown.Helpers.FormHelper.getForm(req.project, req.environment, req.params.id)
        .then((form) => {
            let csv = '';

            for(let inputKey in form.inputs) {
                csv += '"' + inputKey + '",';
            }

            csv += '"time"';
            
            csv += '\r\n';

            for(let entry of form.entries) {
                for(let inputKey in form.inputs) {
                    csv += '"' + (entry[inputKey] || ' ') + '",';
                }
                
                csv += entry.time || 'n/a';
                
                csv += '\r\n';
            }

            res.attachment(form.title.toLowerCase().replace(/ /g, '-') + '_' + new Date().toISOString() + '.csv');

            res.status(200).send(csv);
        })
        .catch((e) => {
            res.status(502).send(FormsController.printError(e));
        });
    }
    
    /**
     * @example POST /api/:project/:environment/forms/:id
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @param {Form} The Form model to update
     *
     * @returns {Form} Form
     */
    static postForm(req, res) {
        let shouldCreate = req.query.create == 'true' || req.query.create == true;
        
        HashBrown.Helpers.FormHelper.setForm(req.project, req.environment, req.params.id, new HashBrown.Models.Form(req.body), shouldCreate)
        .then((form) => {
            res.status(200).send(form.getObject());
        })
        .catch((e) => {
            res.status(502).send(FormsController.printError(e));
        });
    }

    /**
     * @example POST /api/:project/:environment/forms/new
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {String} The created Form id
     */
    static postNew(req, res) {
        HashBrown.Helpers.FormHelper.createForm(req.project, req.environment)
        .then((form) => {
            res.status(200).send(form.id);
        })
        .catch((e) => {
            res.status(502).send(FormsController.printError(e));
        });
    }

    /**
     * @example POST /api/:project/:environment/forms/:id/submit
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @param {Object} entries The submitted entries
     */
    static postSubmit(req, res) {
        // Prevent spam
        if(
            lastIp != req.connection.remoteAddress || // This IP is not the same as the previous one
            Date.now() - lastSubmission >= SUBMISSION_TIMEOUT_MS // Timeout has been reached
        ) {
            lastSubmission = Date.now();
            lastIp = req.connection.remoteAddress;

            HashBrown.Helpers.FormHelper.addEntry(req.project, req.environment, req.params.id, req.body)
            .then((form) => {
                if(form.redirect) {
                    let redirectUrl = form.redirect;

                    if(form.appendRedirect && req.headers.referer) {
                        redirectUrl = req.headers.referer + redirectUrl;
                    }
                    
                    res.status(302).redirect(redirectUrl);
                
                } else {
                    res.sendStatus(200);

                }
            })
            .catch((e) => {
                res.status(400).send(FormsController.printError(e));
            });
        
        } else {
            res.status(400).send(FormsController.printError(new Error('Spam prevention triggered. Please try again later.')));
        
        }
    }

    /**
     * @example POST /api/:project/:environment/forms/clear/:id
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     */
    static postClearAllEntries(req, res) {
        HashBrown.Helpers.FormHelper.clearAllEntries(req.project, req.environment, req.params.id)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((e) => {
            res.status(502).send(FormsController.printError(e));
        });
    }
}

module.exports = FormsController;
