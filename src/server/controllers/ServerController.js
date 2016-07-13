'use strict';

let ApiController = require('./ApiController');

class ServerController extends ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/server/projects', this.getAllProjects);
        app.get('/api/server/:project/environments', this.getAllEnvironments);
    }
    
    /**
     * Gets a list of all projects
     */
    static getAllProjects(req, res) {
        ProjectHelper.getAllProjects()
        .then((projects) => {
            res.send(projects);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }
    
    /**
     * Gets a list of all environments
     */
    static getAllEnvironments(req, res) {
        let project = req.params.project;

        ProjectHelper.getAllEnvironments(project)
        .then((environments) => {
            res.send(environments);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }
}

module.exports = ServerController;
