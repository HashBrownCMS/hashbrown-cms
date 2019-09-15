'use strict';

const Path = require('path');

/**
 * The controller for dashboard related operations
 *
 * @memberof HashBrown.Server.Controller
 */
class ServerController extends HashBrown.Controller.ApiController {
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
        
        app.post('/api/server/projects/new', this.middleware({ needsAdmin: true, setProject: false }), this.createProject);
        app.post('/api/server/backups/:project/new', this.middleware({ needsAdmin: true, setProject: false }), this.postBackupProject);
        app.post('/api/server/backups/:project/upload', this.middleware({ needsAdmin: true, setProject: false }), HashBrown.Service.BackupService.getUploadHandler(), this.postUploadProjectBackup);
        app.post('/api/server/backups/:project/:timestamp/restore', this.middleware({ needsAdmin: true, setProject: false }), this.postRestoreProjectBackup);
        app.post('/api/server/settings/:project/:section', this.middleware({ needsAdmin: true, setProject: false }), this.postProjectSettings);
        app.post('/api/server/migrate/:project/', this.middleware({ needsAdmin: true, setProject: false }), this.postMigrateContent);

        app.put('/api/server/projects/:project/:environment', this.middleware({ needsAdmin: true, setProject: false }), this.putEnvironment);

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
            if(!data.settings[name] && name !== 'settings') { return Promise.resolve(); }

            debug.log('Getting "' + data[source] + '" ' + name + '...', ServerController);

            let getFromDb = () => {
                if(name === 'settings') {
                    return HashBrown.Service.DatabaseService.find(project, 'settings', { usedBy: data[source] });
                }

                return HashBrown.Service.DatabaseService.find(project, data[source] + '.' + name, query || {});
            }

            return getFromDb()
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
                    debug.log('Updating "' + (item.id || item) + '" into ' + resource + '...', ServerController);
                
                    mongoPromise = HashBrown.Service.DatabaseService.updateOne(
                        project,
                        data.to + '.' + resource,
                        { id: item.id },
                        item,
                        { upsert: true }
                    );
                
                // Don't overwrite, keep target resource
                } else {
                    mongoPromise = HashBrown.Service.DatabaseService.count(
                        project,
                        data.to + '.' + resource,
                        { id: item.id }
                    ).then((amount) => {
                        // No matching documents were found, insert resource
                        if(amount < 1) {
                            debug.log('Inserting "' + item.id + '" into ' + resource + '...', this);
                            
                            return HashBrown.Service.DatabaseService.insertOne(
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

            // Merge settings
            if(resource === 'settings') {
                if(!from.settings || !to.settings) { return Promise.resolve(); }

                let fromSettings = from.settings[0];
                let toSettings = to.settings[0];

                fromSettings.usedBy = toSettings.usedBy;

                debug.log('Merging settings from "' + data.from + '" into "' + data.to + '"...', ServerController);

                return HashBrown.Service.DatabaseService.updateOne(project, 'settings', { usedBy: data.to }, fromSettings, { upsert: true }); 
            }

            // Merge non-settings
            return next(0);
        };

        // From
        return getResource('from', 'settings')
        .then(() => {
            return getResource('from', 'connections')
        })
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

        // To
        .then(() => {
            return getResource('to', 'settings');
        })
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

        // Merge "from" and "to"
        .then(() => {
            return mergeResource('settings');
        })
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
   
        HashBrown.Service.ProjectService.checkProject(req.params.project)
        .then(() => {
            return HashBrown.Service.SettingsService.setSettings(req.params.project, null, req.params.section, settings);
        })
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
        HashBrown.Service.UpdateService.check()
        .then((statusObj) => {
            res.status(200).send(statusObj);
        })
        .catch((e) => {
            res.status(502).send(ServerController.printError(e));
        });
    }
    
    /**
     * Gets the backup config
     */
   static getBackupConfig(req, res) {
       HashBrown.Service.BackupService.getConfig()
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
            res.status(200).send(Path.basename(file.filename, Path.extname(file.filename)));

        } else {
            res.status(400).send('File was not provided');    
        }
   } 

    /**
     * Deletes a backup of a project
     */
    static deleteBackup(req, res) {
        HashBrown.Service.BackupService.deleteBackup(req.params.project, req.params.timestamp)
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
        HashBrown.Service.BackupService.getBackupPath(req.params.project, req.params.timestamp)
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
        HashBrown.Service.BackupService.restoreBackup(req.params.project, req.params.timestamp)
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
        HashBrown.Service.BackupService.createBackup(req.params.project)
        .then((data) => {
            res.status(200).send('' + data);
        })
        .catch((e) => {
            res.status(502).send(ServerController.printError(e));
        });
    }

    /**
     * Gets a list of all projects
     */
    static async getAllProjects(req, res) {
        try {
            let projects = [];
            
            if(req.query.ids) {
                projects = await HashBrown.Service.ProjectService.getAllProjectIds();
            } else {
                projects = await HashBrown.Service.ProjectService.getAllProjects();
            }

            let scopedProjects = [];

            if(!req.user.isAdmin) {
                for(let scope in (req.user.scopes || {})) {
                    for(let project of projects) {
                        if(project.id === scope || project === scope) {
                            scopedProjects.push(project);
                            break;
                        }
                    }
                }

            } else {
                scopedProjects = projects;
                    
            }

            res.status(200).send(scopedProjects);

        } catch(e) {
            res.status(502).send(ServerController.printError(e));   
        
        }
    }
    
    /**
     * Gets a project
     */
    static getProject(req, res) {
        let project = req.params.project;

        if(req.user.isAdmin || req.user.scopes[project])  {
            HashBrown.Service.ProjectService.getProject(project)
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
            HashBrown.Service.ProjectService.getAllEnvironments(project)
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

        HashBrown.Service.ProjectService.deleteProject(project)
        .then(() => {
            res.status(200).send('OK');
        })
        .catch((e) => {
            res.status(502).send(ServerController.printError(e));
        });
    }
    
    /**
     * Adds an environment
     */
    static putEnvironment(req, res) {
        let project = req.params.project;
        let environment = req.params.environment;

        HashBrown.Service.ProjectService.addEnvironment(project, environment)
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

        HashBrown.Service.ProjectService.deleteEnvironment(project, environment)
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
        
        HashBrown.Service.ProjectService.createProject(project.name, req.user.id)
        .then((project) => {
            res.status(200).send(project);
        })
        .catch((e) => {
            res.status(502).send(ServerController.printError(e));
        });
    }
}

module.exports = ServerController;
