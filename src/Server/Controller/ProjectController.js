'use strict';

const Path = require('path');

/**
 * The controller for project related operations
 *
 * @memberof HashBrown.Server.Controller
 */
class ProjectController extends HashBrown.Controller.ControllerBase {
    /**
     * Routes
     */
    static get routes() {
        return {
            '/api/projects': {
                handler: this.projects,
                user: true,
            },
            '/api/projects/ids': {
                handler: this.projectIds,
                user: true,
            },
            '/api/projects/new': {
                handler: this.new,
                user: {
                    isAdmin: true
                }
            },
            '/api/projects/${project}': {
                handler: this.project,
                user: true
            },
            '/api/projects/${project}': {
                handler: this.project,
                methods: [ 'DELETE' ],
                user: {
                    isAdmin: true
                }
            },
           
            // Settings
            '/api/projects/${project}/settings': {
                handler: this.settings,
                user: true
            },
            '/api/projects/${project}/settings': {
                handler: this.settings,
                methods: [ 'POST' ],
                user: {
                    isAdmin: true
                }
            },
            '/api/projects/${project}/settings/${section}': {
                handler: this.settings,
                user: true,
            },
            '/api/projects/${project}/settings/${section}': {
                handler: this.settings,
                methods: [ 'POST' ],
                user: {
                    isAdmin: true
                }
            },

            // Environments
            '/api/projects/${project}/environments': {
                handler: this.environments,
                user: true
            },
            '/api/projects/${project}/environments/new': {
                handler: this.newEnvironment,
                methods: [ 'POST' ],
                user: {
                    isAdmin: true
                }
            },            
            '/api/projects/${project}/environment/${environment}': {
                handler: this.deleteEnvironment,
                methods: [ 'DELETE' ],
                user: {
                    isAdmin: true
                }
            },

            // Backups
            '/api/projects/${project}/backups': {
                handler: this.backups,
                user: {
                    isAdmin: true
                }
            },
            '/api/projects/${project}/backups/${timestamp}': {
                handler: this.backup,
                methods: [ 'GET', 'DELETE' ],
                user: {
                    isAdmin: true
                }
            },
            '/api/projects/${project}/backups/${timestamp}/restore': {
                handler: this.restoreBackup,
                methods: [ 'POST' ],
                user: {
                    isAdmin: true
                }
            },
            '/api/projects/${project}/backups/upload': {
                handler: this.uploadBackup,
                methods: [ 'POST' ],
                user: {
                    isAdmin: true
                }
            },
            '/api/projects/${project}/backups/new': {
                handler: this.newBackup,
                methods: [ 'POST' ],
                user: {
                    isAdmin: true
                }
            },
            
            // Users
            '/api/projects/${project}/users': {
                handler: this.users,
                user: true
            },

            // Migration
            '/api/projects/${project}/migrate': {
                handler: this.migrate,
                methods: [ 'POST'],
                user: {
                    isAdmin: true
                }
            }
        };
    }
    
    /**
     * @example GET|POST /api/projects/${project}
     */
    static async project(request, params, body, query, user) {
        if(!user.hasScope(params.project)) {
            return new HttpResponse(`You do not have access to project ${params.project}`, 403);
        }
        
        let project = await HashBrown.Entity.Project.get(params.project);

        if(!project) {
            return new HttpResponse('Not found', 404);
        }

        switch(request.method) {
            case 'GET':
                return new HttpResponse(project);

            case 'DELETE':
                await project.remove();
                
                return new HttpResponse('OK');
        }

        return new HttpResponse('Unexpected error', 500);
    }
    
    /**
     * @example GET /api/projects/ids
     */
    static async projectIds(request, params, body, query, user) {
        let projects = await HashBrown.Entity.Project.listIds();
        
        for(let i = projects.length - 1; i >= 0; i--) {
            let id = projects[i];
           
            if(!user.hasScope(id)) { 
                projects.splice(i, 1);
            }
        }

        return new HttpResponse(projects);
    }
    
    /**
     * @example GET /api/projects
     */
    static async projects(request, params, body, query, user) {
        let projects = await HashBrown.Entity.Project.list();

        for(let i = projects.length - 1; i >= 0; i--) {
            let id = projects[i].id || projects[i];
           
            if(!user.hasScope(id)) { 
                projects.splice(i, 1);
            }
        }

        return new HttpResponse(projects);
    }
    
    /**
     * @example POST /api/projects/new?name=XXX { name: XXX }
     */
    static async newProject(request, params, body, query, user) {
        let project = await HashBrown.Entity.Project.create(query.name || body.name);

        return new HttpResponse(project);
    }
    
    /**
     * @example GET|POST /api/projects/${project}/settings[/${section}] { ... }
     */
    static async settings(request, params, body, query, user) {
        let project = await HashBrown.Entity.Project.get(params.project);
        
        if(!project) {
            return new HttpResponse('Not found', 404);    
        }

        switch(request.method) {
            case 'POST':
                await project.setSettings(params.section, body);
        
                return new HttpResponse('OK');

            case 'GET':
                let settings = await project.getSettings(params.section);
                
                return new HttpResponse(settings);
        }
    }
   
    /**
     * @example GET /api/projects/${project}/environments
     */
    static async environments(request, params, body, query, user) {
        if(!user.hasScope(params.project)) {
            return new HttpResponse(`You do not have access to project ${params.project}`, 403);
        }
        
        let project = await HashBrown.Entity.Project.get(params.project);

        if(!project) {
            return new HttpResponse('Not found', 404);
        }

        let environments = await project.getEnvironments();

        return new HttpResponse(environments);
    }

    /**
     * @example POST /api/projects/${project}/environments/new?name=XXX { name: XXX }
     */
    static async newEnvironment(request, params, body, query, user) {
        let environment = query.name || body.name;
        
        let project = await HashBrown.Entity.Project.get(params.project);

        if(!project) {
            return new HttpResponse('Not found', 404);
        }

        await project.addEnvironment(environment);

        return new HttpResponse('OK');
    }
    
    /**
     * @example DELETE /api/projects/${project}/environments/${environment}
     */
    static async deleteEnvironment(request, params, body, query, user) {
        let environment = params.environment;
        
        let project = await HashBrown.Entity.Project.get(params.project);

        if(!project) {
            return new HttpResponse('Not found', 404);
        }

        await project.removeEnvironment(environment);

        return new HttpResponse('OK');
    }

    
    /**
     * @example POST /api/projects/{project}/backups/${timestamp}/restore
     */
    static async restoreBackup(request, params, body, query, user) {
        await HashBrown.Service.DatabaseService.restore(params.project, params.timestamp);

        return new HttpResponse('OK');
    }
  
    /**
     * @example POST /api/projects/{project}/backups/new
     */
    static async newBackup(request, params, body, query, user) {
        let project = await HashBrown.Entity.Project.get(params.project);

        if(!project) {
            return new HttpResponse('Not found', 404);
        }
        
        await project.createBackup();

        return new HttpResponse('OK');
    }


    /**
     * @example GET|DELETE /api/projects/{project}/backups/${timestamp}
     */
    static async backup(request, params, body, query, user) {
        let path = Path.join(APP_ROOT , 'storage', params.project, 'dump', params.timestamp + '.hba');
        
        switch(request.method) {
            case 'GET':
                let data = await HashBrown.Service.FileService.read(path);

                return new HttpResponse(backup, 200, {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': `attachment; filename="${params.timestamp}.hba"`
                });

            case 'DELETE':
                await HashBrown.Service.FileService.remove(path);

                return new HttpResponse('OK');
        }

        return new HttpResponse('Unexpected error', 500);
    }
    
    /**
     * @example POST /api/projects/{project}/backups/upload
     */
    static async uploadBackup(request, params, body, query, user) {
        if(!body.file) {
            return new HttpResponse('File was not provided', 400);
        }
        
        let timestamp = Path.basename(body.filename, Path.extname(body.filename));

        if(isNaN(timestamp)) { 
            timestamp = Date.now();
        }

        let path = Path.join(APP_ROOT , 'storage', params.project, 'dump', timestamp + '.hba');
    
        await this.uploadFile(request, path);
        
        return new HttpResponse(timestamp);
    } 

    /**
     * @example POST /api/projects/{project}/migrate { from: XXX, to: XXX, replace: true|false }
     */
    static async migrate(request, params, body, query, user) {
        let project = params.project;
        let from = body.from || query.from;
        let to = body.to || query.to;
        let replace = body.replace === 'true' || body.replace === true || query.replace === 'true' || query.replace === true;

        let report = `Migrating resources from ${from} to ${to}...`;

        let collections = await HashBrown.Service.DatabaseService.listCollections(project);
        
        for(let collection of collections) {
            if(collection.name.indexOf(from) + '.' !== 0) { continue; }

            let fromCollectionName = collection.name;
            let toCollectionName = fromCollectionName.replace(from, to);

            report += `\n${fromCollectionName} -> ${toCollectionName}`;

            let fromCollectionItems = await HashBrown.Service.DatabaseService.find(project, fromCollectionName);

            for(let fromCollectionItem of fromCollectionItems) {
                if(!fromCollectionItem.id) { continue; }

                if(replace) {
                    report += `\n    UPDATE ${fromCollectionItem.id}`;

                    await HashBrown.Service.DatabaseService.updateOne(project, toCollectionName, { id: fromCollectionItem.id }, fromCollectionItem, { upsert: true });

                } else {
                    let count = await HashBrown.Service.DatabaseService.count(project, toCollectionName, { id: fromCollectionItem.id });

                    if(count > 0) {
                        report += `\n    SKIP ${fromCollectionItem.id}`;
                        continue;
                    }

                    report += `\n    INSERT ${fromCollectionItem.id}`;

                    await HashBrown.Service.DatabaseService.insertOne(project, toCollectionName, fromCollectionItem);
                }
            }
        }

        report += '\n...done!';

        return new HttpResponse(report, 200);
    }
    
    /**
     * @example GET /api/projects/{project}/users
     */
    static async users(request, params, body, query, user) {
        let project = await HashBrown.Entity.Project.get(params.project);

        if(!project) {
            return new HttpResponse('Project not found', 404);
        }

        let users = await project.getUsers();
    
        return new HttpResponse(users);
    }
}

module.exports = ProjectController;
