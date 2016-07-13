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
        app.post('/api/:project/:environment/forms/:id/submit', bodyparser.urlencoded({extended: true}), this.postSubmit);

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
            res.status(502).send(e);
        });
    }

    /**
     * Submits a form
     */
    static postSubmit(req, res) {
        if(Date.now() - lastSubmission >= SUBMISSION_TIMEOUT_MS) {
            lastSubmission = Date.now();

            FormHelper.setEntry(req.params.id, req.body)
            .then((form) => {
                res.status(200).send(form);
            })
            .catch((err) => {
                res.status(502).send(err);
            });
        } else {
            res.sendStatus(403);
        }
    }
}

module.exports = FormsController;
