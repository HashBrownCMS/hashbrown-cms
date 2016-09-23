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
        app.post('/api/server/migrate/:project/', this.middleware({ setProject: false }), this.postMigrateContent);
        app.post('/api/server/rename/:project/', this.middleware({ setProject: false }), this.postRenameProject);

        app.delete('/api/server/backups/:project/:timestamp', this.middleware({ setProject: false }), this.deleteBackup);
        app.delete('/api/server/projects/:project', this.middleware({ authenticate: false, setProject: false }), this.deleteProject);
    }
    
    /**
     * Migrates content between environments
     */
    static postMigrateContent(req, res) {
        let data = req.body;
        let project = req.params.project;

        let from = {};
        let to = {};

        debug.log('Starting migration from "' + data.from + '" to "' + data.to + '" (replace: ' + (data.settings.replace || false) + ')...', this);

        // Get resources individually
        debug.log('Getting "' + data.from + '" connections...', this);
        MongoHelper.find(project, data.from + '.connections', {})
        .then((result) => {
            from.connections = result;

            debug.log('Getting "' + data.from + '" content...', this);
            return MongoHelper.find(project, data.from + '.content');
        })
        .then((result) => {
            from.content = result;

            debug.log('Getting "' + data.from + '" forms...', this);
            return MongoHelper.find(project, data.from + '.forms');
        })
        .then((result) => {
            from.forms = result;

            debug.log('Getting "' + data.from + '" media...', this);
            return MongoHelper.find(project, data.from + '.media');
        })
        .then((result) => {
            from.media = result;

            debug.log('Getting "' + data.from + '" schemas...', this);
            return MongoHelper.find(project, data.from + '.schemas');
        })
        .then((result) => {
            from.schemas = result;

            debug.log('Getting "' + data.to + '" connections...', this);
            return MongoHelper.find(project, data.to + '.connections', {})
        })
        .then((result) => {
            to.connections = result;

            debug.log('Getting "' + data.to + '" content...', this);
            return MongoHelper.find(project, data.to + '.content', {})
        })
        .then((result) => {
            to.content = result;

            debug.log('Getting "' + data.to + '" forms...', this);
            return MongoHelper.find(project, data.to + '.forms');
        })
        .then((result) => {
            to.forms = result;

            debug.log('Getting "' + data.to + '" media...', this);
            return MongoHelper.find(project, data.to + '.media');
        })
        .then((result) => {
            to.media = result;

            debug.log('Getting "' + data.to + '" schemas...', this);
            return MongoHelper.find(project, data.to + '.schemas');
        })
        .then((result) => {
            to.schemas = result;

            // Merge "from" resource into "to" resource
            function merge(resource) {
                return new Promise((resolve, reject) => {
                    debug.log('Merging ' + resource + '...', this);

                    function next(num) {
                        let item = from[resource][num];

                        if(item) {
                            let mongoPromise;
                            
                            // Overwrite
                            if(data.settings.replace) {
                                debug.log('Updating "' + item.id + '" into ' + resource + '...', this);
                            
                                mongoPromise = MongoHelper.updateOne(
                                    project,
                                    data.to + '.' + resource,
                                    { id: item.id },
                                    item,
                                    { upsert: true }
                                );
                            
                            // Don't overwrite, keep target resource
                            } else {
                                mongoPromise = MongoHelper.count(
                                    project,
                                    data.to + '.' + resource,
                                    { id: item.id }
                                ).then((amount) => {
                                    // No matching documents were found, insert resource
                                    if(amount < 1) {
                                        debug.log('Inserting "' + item.id + '" into ' + resource + '...', this);
                                        
                                        return MongoHelper.insertOne(
                                            project,
                                            data.to + '.' + resource,
                                            item
                                        );
                                    
                                    // The document already exists
                                    } else {
                                        debug.log('"' + item.id + '" already exists in ' + resource + ', skipping...', this);
                                        
                                        return new Promise((resolve) => {
                                            resolve();
                                        });

                                    }
                                });
                                    
                            }
                    
                            mongoPromise        
                            .then(() => {
                                if(num < from[resource].length - 1) {
                                    next(num + 1);
                                } else {
                                    resolve();
                                }
                            })
                            .catch(reject);
                        
                        } else {
                            resolve();

                        }
                    } 

                    next(0);
                });
            }

            return merge('connections')
            .then(() => {
                return merge('content')
            })
            .then(() => {
                return merge('forms');
            })
            .then(() => {
                return merge('media');
            })
            .then(() => {
                return merge('schemas');
            });
        })
        .then(() => {
            res.status(200).send('OK');
        })
        .catch((e) => {
            res.status(502).send(ServerController.printError(e));  
        });
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
            res.status(502).send(ServerController.printError(e));
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
            res.status(502).send(ServerController.printError(e));
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
            res.status(502).send(ServerController.printError(e));  
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
            res.status(502).send(ServerController.printError(e));
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
            res.status(502).send(ServerController.printError(e));
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
            res.status(502).send(ServerController.printError(e));
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
            res.status(502).send(ServerController.printError(e));
        });
    }

    /**
     * Gets a list of all projects
     */
    static getAllProjects(req, res) {
        let user;

        ApiController.authenticate(req.cookies.token)
        .then((authUser) => {
            user = authUser;

            return ProjectHelper.getAllProjects();
        })
        .then((projects) => {
            let scopedProjects = [];

            if(!user.isAdmin) {
                for(let scope in (user.scopes || {})) {
                    if(projects.indexOf(scope) > -1) {
                        scopedProjects.push(scope);
                    }
                }

            } else {
                scopedProjects = projects;
                    
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
            res.status(404).send(ServerController.printError(e));   
        });
    }
    
    /**
     * Gets a project
     */
    static getProject(req, res) {
        let project = req.params.project;

        ApiController.authenticate(req.cookies.token)
        .then((user) => {
            if(user.isAdmin || user.scopes[project])  {
                return ProjectHelper.getProject(project);
            
            } else {
                debug.error('User "' + user.username + '" doesn\'t have project "' + project + '" in scopes', this);

            }
        })
        .then((project) => {
            res.status(200).send(project);
        })
        .catch((e) => {
            res.status(404).send(ServerController.printError(e));
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
            res.status(404).send(ServerController.printError(e));
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
                return new Promise((resolve, reject) => {
                    reject(new Error('Only admins can delete projects'));
                });

            } else {
                return ProjectHelper.deleteProject(project);
            }
        })
        .then(() => {
            res.status(200).send('OK');
        })
        .catch((e) => {
            res.status(502).send(ServerController.printError(e));  
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
            res.status(502).send(ServerController.printError(e));
        });
    }

    /**
     * Renames a project
     */
    static postRenameProject(req, res) {
        let oldName = req.params.project;
        let newName = req.body.name;

        MongoHelper.renameDatabase(oldName, newName)
        .then((msg) => {
            res.status(200).send(msg);
        })
        .catch((e) => {
            res.status(502).send(ServerController.printError(e));
        });
    }
}

module.exports = ServerController;
