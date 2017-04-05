'use strict';

// Libs
let bodyparser = require('body-parser');

// Classes
let ApiController = require('./ApiController');

// Constants
const SUBMISSION_TIMEOUT_MS = 1000;

// Private vars
let lastSubmission = Date.now();
let lastIp = '';

class FormsController extends ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/:project/:environment/forms/', this.middleware(), this.getAllForms);
        app.get('/api/:project/:environment/forms/:id', this.middleware(), this.getForm);
        app.get('/api/:project/:environment/forms/:id/entries', this.middleware(), this.getAllEntries);

        app.post('/api/:project/:environment/forms/new', this.middleware(), this.postNew);
        app.post('/api/:project/:environment/forms/:id', this.middleware(), this.postForm);
        app.post('/api/:project/:environment/forms/:id/submit', this.middleware({ authenticate: false, allowCORS: this.checkCORS }), bodyparser.urlencoded({extended: true}), this.postSubmit);
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
        return FormHelper.getForm(req.params.project, req.params.environment, req.params.id)
        .then((form) => {
            return Promise.resolve(form.allowedOrigin || '*');
        });
    }

    /**
     * Gets all forms
     */
    static getAllForms(req, res) {
        FormHelper.getAllForms(req.project, req.environment)
        .then((forms) => {
            res.status(200).send(forms);
        })
        .catch((e) => {
            res.status(502).send(FormsController.printError(e));
        });
    }
    
    /**
     * Deletes a single Form by id
     */
    static deleteForm(req, res) {
        FormHelper.deleteForm(req.project, req.environment, req.params.id)
        .then(() => {
            res.status(200).send('OK');
        })
        .catch((e) => {
            res.status(502).send(FormsController.printError(e));
        });
    }
    
    /**
     * Pulls Form by id
     */
    static pullForm(req, res) {
        let id = req.params.id;

        SyncHelper.getResourceItem(req.project, req.environment, 'forms', id)
        .then((resourceItem) => {
            if(!resourceItem) { return Promise.reject(new Error('Couldn\'t find remote Form "' + id + '"')); }
       
            return FormHelper.setForm(req.project, req.environment, id, resourceItem)
            .then(() => {
                res.status(200).send(resourceItem);
            });
        })
        .catch((e) => {
            res.status(404).send(FormController.printError(e));   
        }); 
    }
    
    /**
     * Pushes Form by id
     */
    static pushForm(req, res) {
        let id = req.params.id;

        FormHelper.getForm(req.project, req.environment, id)
        .then((localForm) => {
            return SyncHelper.setResourceItem(req.project, req.environment, 'forms', id, localForm);
        })
        .then(() => {
            res.status(200).send(id);
        })
        .catch((e) => {
            res.status(404).send(FormController.printError(e));   
        }); 
    }

    /**
     * Gets a single form by id
     */
    static getForm(req, res) {
        FormHelper.getForm(req.project, req.environment, req.params.id)
        .then((form) => {
            res.status(200).send(form.getObject());
        })
        .catch((e) => {
            res.status(502).send(FormsController.printError(e));
        });
    }
    
    /**
     * Gets all entries from a Form as CSV
     */
    static getAllEntries(req, res) {
        FormHelper.getForm(req.project, req.environment, req.params.id)
        .then((form) => {
            let csv = '';

            for(let inputKey in form.inputs) {
                csv += '"' + inputKey + '",';
            }

            // Remove last comma
            csv = csv.slice(0, -1);
            csv += '\r\n';

            for(let entry of form.entries) {
                for(let inputKey in form.inputs) {
                    csv += '"' + (entry[inputKey] || ' ') + '",';
                }
                
                // Remove last comma
                csv = csv.slice(0, -1);
                csv += '\r\n';
            }

            res.attachment('entries-' + form.id + '.csv');

            res.status(200).send(csv);
        })
        .catch((e) => {
            res.status(502).send(FormsController.printError(e));
        });
    }
    
    /**
     * Sets a single form by id
     */
    static postForm(req, res) {
        let shouldCreate = req.query.create == 'true' || req.query.create == true;
        
        FormHelper.setForm(req.project, req.environment, req.params.id, req.body, shouldCreate)
        .then((form) => {
            res.status(200).send(form.getObject());
        })
        .catch((e) => {
            res.status(502).send(FormsController.printError(e));
        });
    }

    /**
     * Creates a form
     */
    static postNew(req, res) {
        FormHelper.createForm(req.project, req.environment)
        .then((form) => {
            res.status(200).send(form.id);
        })
        .catch((e) => {
            res.status(502).send(FormsController.printError(e));
        });
    }

    /**
     * Submits a form
     */
    static postSubmit(req, res) {
        // Prevent spam
        if(
            lastIp != req.connection.remoteAddress || // This IP is not the same as the previous one
            Date.now() - lastSubmission >= SUBMISSION_TIMEOUT_MS // Timeout has been reached
        ) {
            lastSubmission = Date.now();
            lastIp = req.connection.remoteAddress;

            FormHelper.addEntry(req.project, req.environment, req.params.id, req.body)
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
            res.status(400).send(ApiController.printError(new Error('Spam prevention triggered. Please try again later.')));
        
        }
    }

    /**
     * Clears all form entries
     */
    static postClearAllEntries(req, res) {
        FormHelper.clearAllEntries(req.project, req.environment, req.params.id)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((e) => {
            res.status(502).send(ApiController.printError(e));
        });
    }
}

module.exports = FormsController;
