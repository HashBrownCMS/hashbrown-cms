'use strict';

const ScheduleHelper = require('Server/Helpers/ScheduleHelper');

const ApiController = require('./ApiController');

/**
 * The Controller for scheduled Tasks
 *
 * @memberof HashBrown.Server.Controllers
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
