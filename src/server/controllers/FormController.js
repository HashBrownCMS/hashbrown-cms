'use strict';

// Libs
let bodyparser = require('body-parser');

// Classes
let Controller = require('./Controller');

// Constants
const SUBMISSION_MIN_TIMER_MS = 500;

class FormController extends Controller {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.post('/api/:project/:environment/form/:id/submit', bodyparser.urlencoded({extended: true}), this.postSubmit);

        // Init spam prevention timer
        FormController.lastSubmission = Date.now();
    }
        
    /**
     * Submits a form
     */
    static postSubmit(req, res) {
        if(Date.now() - FormController.lastSubmission >= SUBMISSION_MIN_TIMER_MS) {
            FormController.lastSubmission = Date.now();

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

module.exports = FormController;
