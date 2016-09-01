'use strict';

let ApiController = require('./ApiController');

class ServerController extends ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/server/projects', this.middleware({ authenticate: false, setProject: false }), this.getAllProjects);
        app.get('/api/server/projects/:project', this.middleware({ authenticate: false, setProject: false }), this.getProject);
        app.get('/api/server/:project/environments', this.middleware({ authenticate: false, setProject: false }), this.getAllEnvironments);
    }
    
    /**
     * Gets a list of all projects
     */
    static getAllProjects(req, res) {
        let scopes = {};

        ApiController.authenticate(req.cookies.token)
        .then((user) => {
            scopes = user.scopes;

            return ProjectHelper.getAllProjects();
        })
        .then((projects) => {
            let scopedProjects = [];

            for(let scope in scopes) {
                if(projects.indexOf(scope) > -1) {
                    scopedProjects.push(scope);
                }
            }

            res.send(scopedProjects);
        })
        .catch((e) => {
            res.status(404).send(e.message);   
        });
    }
    
    /**
     * Gets a project
     */
    static getProject(req, res) {
        let project = req.params.project;

        ApiController.authenticate(req.cookies.token)
        .then((user) => {
            if(user.scopes[project])  {
                return ProjectHelper.getProject(project);
            
            } else {
                debug.error('User "' + user.username + '" doesn\'t have project "' + project + '" in scopes', this);

            }
        })
        .then((project) => {
            res.send(project);
        })
        .catch((e) => {
            res.status(404).send(e.message);
        });
    }
    
    /**
     * Gets a list of all environments
     */
    static getAllEnvironments(req, res) {
        let project = req.params.project;

        ApiController.authenticate(req.cookies.token)
        .then((user) => {
            if(user.scopes[project])  {
                return ProjectHelper.getAllEnvironments(project)
            
            } else {
                debug.error('User "' + user.username + '" doesn\'t have project "' + project + '" in scopes', this);

            }
        })
        .then((environments) => {
            res.send(environments);
        })
        .catch((e) => {
            res.status(404).send(e.message);
        });
    }
}

module.exports = ServerController;
