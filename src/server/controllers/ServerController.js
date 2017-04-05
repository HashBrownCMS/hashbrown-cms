'use strict';

let ApiController = require('./ApiController');

class ServerController extends ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/server/update/check', this.middleware({ setProject: false }), this.getUpdateCheck);
        app.get('/api/server/projects', this.middleware({ setProject: false }), this.getAllProjects);
        app.get('/api/server/projects/:project', this.middleware({ setProject: false }), this.getProject);
        app.get('/api/server/:project/environments', this.middleware({ setProject: false }), this.getAllEnvironments);
        app.get('/api/server/backups/:project/:timestamp.hba', this.middleware({ setProject: false }), this.getBackup);
        app.get('/api/server/backups/config', this.middleware({ needsAdmin: true, setProject: false }), this.getBackupConfig);
        
        app.post('/api/server/update/start', this.middleware({ needsAdmin: true, setProject: false }), this.postUpdateServer);
        app.post('/api/server/restart', this.middleware({ needsAdmin: true, setProject: false }), this.postRestartServer);
        app.post('/api/server/projects/new', this.middleware({ needsAdmin: true, setProject: false }), this.createProject);
        app.post('/api/server/backups/:project/new', this.middleware({ needsAdmin: true, setProject: false }), this.postBackupProject);
        app.post('/api/server/backups/:project/upload', this.middleware({ needsAdmin: true, setProject: false }), BackupHelper.getUploadHandler(), this.postUploadProjectBackup);
        app.post('/api/server/backups/:project/:timestamp/restore', this.middleware({ needsAdmin: true, setProject: false }), this.postRestoreProjectBackup);
        app.post('/api/server/settings/:project/:section', this.middleware({ needsAdmin: true, setProject: false }), this.postProjectSettings);
        app.post('/api/server/migrate/:project/', this.middleware({ needsAdmin: true, setProject: false }), this.postMigrateContent);
        app.post('/api/server/rename/:project/', this.middleware({ needsAdmin: true, setProject: false }), this.postRenameProject);

        app.delete('/api/server/backups/:project/:timestamp', this.middleware({ needsAdmin: true, setProject: false }), this.deleteBackup);
        app.delete('/api/server/projects/:project', this.middleware({ needsAdmin: true, setProject: false }), this.deleteProject);
        app.delete('/api/server/projects/:project/:environment', this.middleware({ needsAdmin: true, setProject: false }), this.deleteEnvironment);
    }
    
    /**
     * Migrates content between environments
     */
    static postMigrateContent(req, res) {
        let data = req.body;
        let project = req.params.project;

        let from = {};
        let to = {};

        debug.log('Starting migration from "' + data.from + '" to "' + data.to + '" (replace: ' + (data.settings.replace || false) + ')...', ServerController);

        // Gets resource if specified in settings
        let getResource = (source, name, query) => {
            if(!data.settings[name]) { return Promise.resolve(); }

            debug.log('Getting "' + data[source] + '" ' + name + '...', ServerController);
        
            return MongoHelper.find(project, data[source] + '.' + name, query)
            .then((result) => {
                if(source === 'from') { 
                    from[name] = result;
                } else {
                    to[name] = result;
                }

                return Promise.resolve();
            });
        };
            
        // Merge "from" resource into "to" resource
        let mergeResource = (resource) => {
            if(!from[resource]) { return Promise.resolve(); }
            
            debug.log('Merging ' + resource + '...', ServerController);

            let next = (num) => {
                if(!from[resource][num]) { return Promise.resolve(); }

                let item = from[resource][num];

                let mongoPromise;
                
                // Overwrite
                if(data.settings.replace) {
                    debug.log('Updating "' + (item.id || item.section || item) + '" into ' + resource + '...', ServerController);
                
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
        
                return mongoPromise        
                .then(() => {
                    if(num < from[resource].length - 1) {
                        return next(num + 1);
                    } else {
                        return Promise.resolve();
                    }
                });
            }; 

            return next(0);
        };

        // From
        return getResource('from', 'connections', {})
        .then(() => {
            return getResource('from', 'content');
        })
        .then(() => {
            return getResource('from', 'forms');
        })
        .then(() => {
            return getResource('from', 'media');
        })
        .then(() => {
            return getResource('from', 'schemas');
        })
        .then(() => {
            return getResource('from', 'settings');
        })

        // To
        .then(() => {
            return getResource('to', 'connections');
        })
        .then(() => {
            return getResource('to', 'content');
        })
        .then(() => {
            return getResource('to', 'forms');
        })
        .then(() => {
            return getResource('to', 'media');
        })
        .then(() => {
            return getResource('to', 'schemas');
        })
        .then(() => {
            return getResource('to', 'settings');
        })

        // Merge "from" and "to"
        .then(() => {
            return mergeResource('connections');
        })
        .then(() => {
            return mergeResource('content');
        })
        .then(() => {
            return mergeResource('forms');
        })
        .then(() => {
            return mergeResource('media');
        })
        .then(() => {
            return mergeResource('schemas');
        })
        .then(() => {
            return mergeResource('settings');
        })

        // Success
        .then(() => {
            debug.log('Successfully migrated "' + data.from + '" to "' + data.to + '"', ServerController);

            res.status(200).send('OK');
        })

        // Fail
        .catch((e) => {
            res.status(502).send(ServerController.printError(e));  
        });
    }

    /**
     * Update project settings
     */
    static postProjectSettings(req, res) {
        let settings = req.body;
    
        SettingsHelper.setSettings(req.params.project, null, req.params.section, settings)
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
     * Restarts the server
     */
    static postRestartServer(req, res) {
        res.status(200).send('OK');

        // Shut down HashBrown, let serverside task manager handle restart
        process.exit(1);
    }

    /**
     * Updates the server
     */
    static postUpdateServer(req, res) {
        UpdateHelper.update()
        .then(() => {
            res.status(200).send('OK');

            // Shut down HashBrown, let serverside task manager handle restart
            process.exit(1);
        })
        .catch((e) => {
            res.status(502).send(ServerController.printError(e));  
        });
    }

    /**
     * Gets the backup config
     */
   static getBackupConfig(req, res) {
       BackupHelper.getConfig()
       .then((config) => {
            res.status(200).send(config);
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
        ProjectHelper.getAllProjects()
        .then((projects) => {
            let scopedProjects = [];

            if(!req.user.isAdmin) {
                for(let scope in (req.user.scopes || {})) {
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
            res.status(502).send(ServerController.printError(e));   
        });
    }
    
    /**
     * Gets a project
     */
    static getProject(req, res) {
        let project = req.params.project;

        if(req.user.isAdmin || req.user.scopes[project])  {
            ProjectHelper.getProject(project)
            .then((project) => {
                res.status(200).send(project);
            })
            .catch((e) => {
                res.status(404).send(ServerController.printError(e));
            });
        
        } else {
            res.status(403).send('User "' + req.user.username + '" doesn\'t have project "' + project + '" in scopes');

        }
    }
    
    /**
     * Gets a list of all environments
     */
    static getAllEnvironments(req, res) {
        let project = req.params.project;

        if(req.user.hasScope(project))  {
            ProjectHelper.getAllEnvironments(project)
            .then((environments) => {
                res.status(200).send(environments);
            })
            .catch((e) => {
                res.status(404).send(ServerController.printError(e));
            });

        } else {
            res.status(403).send('User "' + req.user.username + '" doesn\'t have project "' + project + '" in scopes');

        }
    }

    /**
     * Deletes a project
     */
    static deleteProject(req, res) {
        let project = req.params.project;

        ProjectHelper.deleteProject(project)
        .then(() => {
            res.status(200).send('OK');
        })
        .catch((e) => {
            res.status(502).send(ServerController.printError(e));
        });
    }
    
    /**
     * Deletes an environment
     */
    static deleteEnvironment(req, res) {
        let project = req.params.project;
        let environment = req.params.environment;

        ProjectHelper.deleteEnvironment(project, environment)
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
        let project = req.body
        
        ProjectHelper.createProject(project.name, req.user.id)
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
