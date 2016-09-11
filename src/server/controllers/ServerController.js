'use strict';

let ApiController = require('./ApiController');

class ServerController extends ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/server/update/check', this.middleware({ setProject: false }), this.getUpdateCheck);
        app.get('/api/server/projects', this.middleware({ authenticate: false, setProject: false }), this.getAllProjects);
        app.get('/api/server/projects/:project', this.middleware({ authenticate: false, setProject: false }), this.getProject);
        app.get('/api/server/:project/environments', this.middleware({ authenticate: false, setProject: false }), this.getAllEnvironments);
        app.get('/api/server/backups/:project/:timestamp.hba', this.middleware({ setProject: false }), this.getBackup);
        
        app.post('/api/server/update/start', this.middleware({ authenticate: false, setProject: false }), this.postUpdateServer);
        app.post('/api/server/projects/new', this.middleware({ authenticate: false, setProject: false }), this.createProject);
        app.post('/api/server/backups/:project/new', this.middleware({ setProject: false }), this.postBackupProject);
        app.post('/api/server/backups/:project/upload', this.middleware({ setProject: false }), BackupHelper.getUploadHandler(), this.postUploadProjectBackup);
        app.post('/api/server/backups/:project/:timestamp/restore', this.middleware({ setProject: false }), this.postRestoreProjectBackup);
        app.post('/api/server/settings/:project/:section', this.middleware({ setProject: false }), this.postProjectSettings);

        app.delete('/api/server/backups/:project/:timestamp', this.middleware({ setProject: false }), this.deleteBackup);
        app.delete('/api/server/projects/:project', this.middleware({ authenticate: false, setProject: false }), this.deleteProject);
    }
    
    /**
     * Update project settings
     */
    static postProjectSettings(req, res) {
        let settings = req.body;
    
        ProjectHelper.currentProject = req.params.project;

        SettingsHelper.setSettings(req.params.section, settings)
        .then(() => {
            res.status(200).send(settings);
        })
        .catch((e) => {
            res.status(502).send(ApiController.error(e));
        });
    }
        
    /**
     * Checks for new updates
     */
    static getUpdateCheck(req, res) {
        UpdateHelper.check()
        .then((statusObj) => {
            res.status(200).send(statusObj);
        })
        .catch((e) => {
            res.status(502).send(ApiController.error(e));
        });
    }

    /**
     * Updates the server
     */
    static postUpdateServer(req, res) {
        ApiController.authenticate(req.cookies.token)
        .then((user) => {
            if(!user.isAdmin) {
                throw new Error('Only admins can update HashBrown');

            } else {
                return UpdateHelper.update();
            }
        })
        .then(() => {
            res.status(200).send('OK');

            process.exit(1);
        })
        .catch((e) => {
            res.status(502).send(e.message);  
        });
    }

    /**
     * Uploads a project backup
     */
   static postUploadProjectBackup(req, res) {
        let file = req.file;

        if(file) {
            res.status(200).send('OK');

        } else {
            res.status(400).send('File was not provided');    
        }
   } 

    /**
     * Deletes a backup of a project
     */
    static deleteBackup(req, res) {
        BackupHelper.deleteBackup(req.params.project, req.params.timestamp)
        .then((path) => {
            res.status(200).send('OK');
        })
        .catch((e) => {
            res.status(502).send(e.message);
        });
    }
    
    /**
     * Gets a backup of a project
     */
    static getBackup(req, res) {
        BackupHelper.getBackupPath(req.params.project, req.params.timestamp)
        .then((path) => {
            res.status(200).sendFile(path);
        })
        .catch((e) => {
            res.status(502).send(e.message);
        });
    }
    
    /**
     * Restores a backup of a project
     */
    static postRestoreProjectBackup(req, res) {
        BackupHelper.restoreBackup(req.params.project, req.params.timestamp)
        .then((data) => {
            res.status(200).send(data);
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

            scopedProjects.sort((a, b) => {
                if(a < b) {
                    return -1;
                }
                
                if(a > b) {
                    return 1;
                }

                return 0;
            });

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
