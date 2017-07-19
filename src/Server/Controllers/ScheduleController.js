'use strict';

// Classes
let ApiController = require('./ApiController');

/**
 * The Controller for scheduled Tasks
 */
class ScheduleController extends ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/:project/:environment/schedule/:contentId', this.middleware(), this.getTasks);
    }        

    /**
     * Gets a list of tasks
     */
    static getTasks(req, res) {
         ScheduleHelper.getTasks(null, { content: req.params.contentId })
        .then((tasks) => {
            res.status(200).send(tasks);
        })
        .catch((e) => {
            res.status(400).send(ScheduleController.printError(e));
        });
    }
}

module.exports = ScheduleController;
