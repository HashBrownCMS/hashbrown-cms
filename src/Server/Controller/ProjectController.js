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
                methods: [ 'POST' ],
                user: {
                    isAdmin: true
                }
            },
            '/api/projects/${project}': {
                handler: this.project,
                methods: [ 'GET', 'DELETE' ],
                user: true
            },
           
            // Settings
            '/api/projects/${project}/settings': {
                handler: this.settings,
                methods: [ 'GET', 'POST' ],
                user: true
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
            
            // Sync
            '/api/projects/${project}/sync/token': {
                handler: this.syncToken,
                methods: [ 'POST' ],
                user: {
                    isAdmin: true
                }
            },

            // Users
            '/api/projects/${project}/users': {
                handler: this.users,
                user: true
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
                if(!user.isAdmin) {
                    return new HttpResponse('Only admins can remove projects', 403);
                }

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

        return new HttpResponse(projects, 200, { 'Cache-Control': 'no-store' });
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

        return new HttpResponse(projects, 200, { 'Cache-Control': 'no-store' });
    }
    
    /**
     * @example POST /api/projects/new?name=XXX { name: XXX }
     */
    static async new(request, params, body, query, user) {
        let project = await HashBrown.Entity.Project.create(query.name || body.name);

        return new HttpResponse(project);
    }
   
    /**
     * @example POST /api/projects/${project}/sync/token?username=XXX&password=XXX&url=XXX { username: XXX, password: XXX, url: XXX }
     */
    static async syncToken(request, params, body, query, user) {
        let username = query.username || body.username;
        let password = query.password || body.password;
        let url = query.url || body.url;

        let project = await HashBrown.Entity.Project.get(params.project);
        
        if(!project) {
            return new HttpResponse('Not found', 404);    
        }

        let token = await project.getSyncToken(username, password, url);

        return new HttpResponse(token, 200, { 'Cache-Control': 'no-store' });
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
                if(!user.isAdmin) {
                    return new HttpResponse('Only admins can change project settings', 403);
                }

                await project.setSettings(body, params.section);
        
                return new HttpResponse('OK');

            case 'GET':
                let settings = await project.getSettings(params.section);
                
                return new HttpResponse(settings, 200, { 'Cache-Control': 'no-store' });
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

        return new HttpResponse(environments, 200, { 'Cache-Control': 'no-store' });
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
        if(!body.files || !body.files[0] || !body.files[0].filename || !body.files[0].base64) {
            return new HttpResponse('File was not provided', 400);
        }
        
        let file = body.files[0];

        let timestamp = Path.basename(file.filename, Path.extname(file.filename));

        if(isNaN(timestamp)) { 
            timestamp = Date.now();
        }

        let dirPath = Path.join(APP_ROOT , 'storage', params.project, 'dump');
        let filePath = Path.join(dirPath, timestamp + '.hba');

        if(!HashBrown.Service.FileService.exists(dirPath)) {
            await HashBrown.Service.FileService.makeDirectory(dirPath);
        }

        let fileData = Buffer.from(file.base64, 'base64');

        await HashBrown.Service.FileService.write(fileData, filePath);
        
        return new HttpResponse(timestamp);
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
    
        return new HttpResponse(users, 200, { 'Cache-Control': 'no-store' });
    }
}

module.exports = ProjectController;
