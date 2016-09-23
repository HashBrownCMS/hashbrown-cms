'use strict';

// Libs
let bodyparser = require('body-parser');

// Classes
let ApiController = require('./ApiController');

// Constants
const SUBMISSION_TIMEOUT_MS = 500;

// Private vars
let lastSubmission = Date.now();

class FormsController extends ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/:project/:environment/forms/', this.middleware(), this.getAllForms);
        app.get('/api/:project/:environment/forms/:id', this.middleware(), this.getForm);

        app.post('/api/:project/:environment/forms/new', this.middleware(), this.postNew);
        app.post('/api/:project/:environment/forms/:id', this.middleware(), this.postForm);
        app.post('/api/:project/:environment/forms/:id/submit', this.middleware({ authenticate: false, allowCORS: true }), bodyparser.urlencoded({extended: true}), this.postSubmit);

        app.delete('/api/:project/:environment/forms/:id', this.middleware(), this.deleteForm);
        
        // Init spam prevention timer
        lastSubmission = Date.now();
    }
        
    /**
     * Gets all forms
     */
    static getAllForms(req, res) {
        FormHelper.getAllForms()
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
        FormHelper.deleteForm(req.params.id)
        .then(() => {
            res.status(200).send('OK');
        })
        .catch((e) => {
            res.status(502).send(FormsController.printError(e));
        });
    }

    /**
     * Gets a single form by id
     */
    static getForm(req, res) {
        FormHelper.getForm(req.params.id)
        .then((form) => {
            res.status(200).send(form.getObject());
        })
        .catch((e) => {
            res.status(502).send(FormsController.printError(e));
        });
    }
    
    /**
     * Sets a single form by id
     */
    static postForm(req, res) {
        FormHelper.setForm(req.params.id, req.body)
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
        FormHelper.createForm()
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
        if(Date.now() - lastSubmission >= SUBMISSION_TIMEOUT_MS) {
            lastSubmission = Date.now();

            FormHelper.addEntry(req.params.id, req.body)
            .then((form) => {
                if(!form.redirect) {
                    res.status(200).redirect(req.headers.referer);
                } else {
                    res.status(200).redirect(form.redirect);
                }
            })
            .catch((e) => {
                res.status(400).send(FormsController.printError(e));
            });
        } else {
            res.status(400).send('Submission spam prevention timeout not yet passed');
        }
    }
}

module.exports = FormsController;
