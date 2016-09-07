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
        app.get('/api/server/backups/:project/:time', this.middleware({ setProject: false }), this.getBackup);
        
        app.post('/api/server/projects/new', this.middleware({ authenticate: false, setProject: false }), this.createProject);
        app.post('/api/server/backups/:project/new', this.middleware({ setProject: false }), this.postBackupProject);
        
        app.delete('/api/server/projects/:project', this.middleware({ authenticate: false, setProject: false }), this.deleteProject);
    }
    
    /**
     * Gets a backup of a project
     */
    static getBackup(req, res) {
        BackupHelper.getBackupPath(req.params.project, req.params.time)
        .then((path) => {
            res.status(200).sendFile(path);
        })
        .catch((e) => {
            res.status(502).send(e.message);
        });
    }

    /**
     * Makes a backup of a project
     */
    static postBackupProject(req, res) {
        BackupHelper.createBackup(req.params.project)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((e) => {
            res.status(502).send(e.message);
        });
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

            res.status(200).send(scopedProjects);
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
            res.status(200).send(project);
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
            res.status(200).send(environments);
        })
        .catch((e) => {
            res.status(404).send(e.message);
        });
    }

    /**
     * Deletes a project
     */
    static deleteProject(req, res) {
        let project = req.params.project;

        ApiController.authenticate(req.cookies.token)
        .then((user) => {
            if(!user.isAdmin) {
                throw new Error('Only admins can delete projects');

            } else {
                return MongoHelper.dropDatabase(project);
            }
        })
        .then(() => {
            res.status(200).send('OK');
        })
        .catch((e) => {
            res.status(502).send(e.message);  
        });
    }

    /**
     * Creates a new project
     */
    static createProject(req, res) {
        let project = req.body.project;
        
        ApiController.authenticate(req.cookies.token)
        .then((user) => {
            if(!user.isAdmin) {
                throw new Error('Only admins can create new projects');

            } else {
                return ProjectHelper.createProject(project, user.id);
            }
        })
        .then((project) => {
            res.status(200).send(project);
        })
        .catch((e) => {
            res.status(502).send(e.message);
        });
    }
}

module.exports = ServerController;
