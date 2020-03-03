'use strict';

/**
 * The Controller for scheduled Tasks
 *
 * @memberof HashBrown.Server.Controller
 */
class ScheduleController extends HashBrown.Controller.ControllerBase {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/:project/:environment/schedule/:contentId', this.middleware(), this.getTasks);
    }        

    /**
     * @example GET /api/:project/:environment/schedule/:contentId
     *
     * @apiGroup Schedule
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} contentId
     *
     * @returns {Array} Tasks
     */
    static getTasks(req, res) {
         HashBrown.Service.ScheduleService.getTasks(null, { content: req.params.contentId })
        .then((tasks) => {
            res.status(200).send(tasks);
        })
        .catch((e) => {
            res.status(400).send(ScheduleController.printError(e));
        });
    }
}

module.exports = ScheduleController;
