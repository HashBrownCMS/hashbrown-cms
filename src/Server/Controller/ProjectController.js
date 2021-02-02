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
            
            // Migrate
            '/api/projects/${project}/migrate': {
                handler: this.migrateEnvironment,
                methods: [ 'POST' ],
                user: {
                    isAdmin: true
                }
            },
           
            // Settings
            '/api/projects/${project}/settings': {
                handler: this.settings,
                methods: [ 'GET', 'POST' ],
                user: true
            },
            '/api/projects/${project}/settings/${section}': {
                handler: this.settings,
                methods: [ 'GET', 'POST' ],
                user: true
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
            '/api/projects/${project}/environments/${environment}': {
                handler: this.environment,
                methods: [ 'GET', 'POST', 'DELETE' ],
                user: true
            },
            '/api/projects/${project}/environments/${environment}/${section}': {
                handler: this.environment,
                methods: [ 'GET', 'POST' ],
                user: true
            },

            // Backups
            '/api/projects/${project}/backups': {
                handler: this.backups,
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
     * Modifies a project
     *
     * @example GET|POST /api/projects/${project}
     */
    static async project(request, params, body, query, context) {
        if(!context.user.hasScope(params.project)) {
            return new HashBrown.Http.Response(`You do not have access to project ${params.project}`, 403);
        }
        
        switch(request.method) {
            case 'GET':
                return new HashBrown.Http.Response(context.project);

            case 'DELETE':
                if(!context.user || !context.user.isAdmin) {
                    return new HashBrown.Http.Response('Only admins can remove projects', 403);
                }
                
                // Check if this project is specified in the config
                if(request.method !== 'GET' && Array.isArray(context.config.system.projects)) {
                    for(let definition of context.config.system.projects) {
                        if(definition.id !== context.project.id) { continue; }
                    
                        return new HashBrown.Http.Response('This project was defined by the server admin and cannot be removed', 403);
                    }
                }

                await context.project.remove();
                
                return new HashBrown.Http.Response('OK');
        }

        return new HashBrown.Http.Response('Unexpected error', 500);
    }
    
    /**
     * Lists all project ids
     *
     * @example GET /api/projects/ids
     */
    static async projectIds(request, params, body, query, context) {
        let projects = await HashBrown.Entity.Project.listIds();
        
        for(let i = projects.length - 1; i >= 0; i--) {
            let id = projects[i];
           
            if(!context.user.hasScope(id)) { 
                projects.splice(i, 1);
            }
        }

        return new HashBrown.Http.Response(projects, 200, { 'Cache-Control': 'no-store' });
    }
    
    /**
     * Lists all projects
     *
     * @example GET /api/projects
     */
    static async projects(request, params, body, query, context) {
        let projects = await HashBrown.Entity.Project.list();

        for(let i = projects.length - 1; i >= 0; i--) {
            let id = projects[i].id || projects[i];
           
            if(!context.user.hasScope(id)) { 
                projects.splice(i, 1);
            }
        }

        return new HashBrown.Http.Response(projects, 200, { 'Cache-Control': 'no-store' });
    }
    
    /**
     * Creates a new project
     *
     * @example POST /api/projects/new?name=XXX&id=XXX { name: XXX, id: XXX }
     */
    static async new(request, params, body, query, context) {
        if(context.config.system.canAddProjects === false) {
            return new HashBrown.Http.Response('Adding projects has been disabled by the admin', 403);
        }

        let project = await HashBrown.Entity.Project.create(query.name || body.name, query.id || body.id);

        return new HashBrown.Http.Response(project);
    }
   
    /**
     * Gets a new sync token
     *
     * @example POST /api/projects/${project}/sync/token?username=XXX&password=XXX&url=XXX { username: XXX, password: XXX, url: XXX }
     */
    static async syncToken(request, params, body, query, context) {
        let username = query.username || body.username;
        let password = query.password || body.password;
        let url = query.url || body.url;

        let token = await context.project.getSyncToken(username, password, url);

        return new HashBrown.Http.Response(token, 200, { 'Cache-Control': 'no-store' });
    }

    /**
     * Modifies the settings of a project
     *
     * @example GET|POST /api/projects/${project}/settings[/${section}] { ... }
     */
    static async settings(request, params, body, query, context) {
        switch(request.method) {
            case 'POST':
                if(!context.user.isAdmin) {
                    return new HashBrown.Http.Response('Only admins can change project settings', 403);
                }

                await context.project.setSettings(body, params.section);
        
                return new HashBrown.Http.Response('OK');

            case 'GET':
                let settings = await context.project.getSettings(params.section);
               
                return new HashBrown.Http.Response(settings, 200, { 'Cache-Control': 'no-store' });
        }
    }
   
    /**
     * Lists all environments of a project
     *
     * @example GET /api/projects/${project}/environments
     */
    static async environments(request, params, body, query, context) {
        if(!context.user.hasScope(params.project)) {
            return new HashBrown.Http.Response(`You do not have access to project ${params.project}`, 403);
        }
        
        let environments = await context.project.getEnvironments();

        return new HashBrown.Http.Response(environments, 200, { 'Cache-Control': 'no-store' });
    }
    
    /**
     * Migrates resources between environments
     *
     * @example POST /api/projects/${project}/migrate?from=XXX&to=XXX { from: XXX, to: XXX }
     */
    static async migrateEnvironment(request, params, body, query, context) {
        await context.project.migrateEnvironment(query.from || body.from, query.to || body.to);

        return new HashBrown.Http.Response('OK');
    }

    /**
     * Creates a new environment
     *
     * @example POST /api/projects/${project}/environments/new?name=XXX&from=XXX { name: XXX, from: XXX }
     */
    static async newEnvironment(request, params, body, query, context) {
        if(context.config.system.canAddEnvironments === false) {
            return new HashBrown.Http.Response('Adding projects has been disabled by the admin', 403);
        }
        
        let environment = query.name || body.name;
        
        await context.project.addEnvironment(environment, { from: query.from || body.from });

        return new HashBrown.Http.Response('OK');
    }
    
    /**
     * Modifies an environment
     *
     * @example GET|POST|DELETE /api/projects/${project}/environments/${environment}
     */
    static async environment(request, params, body, query, context) {
        let settings = await context.project.getEnvironmentSettings(params.environment, params.section);

        switch(request.method) {
            case 'GET':
                return new HashBrown.Http.Response(settings);

            case 'POST':
                if(!context.user.isAdmin) {
                    return new HashBrown.Http.Response('Only admins can edit environments', 403);
                }
                
                await context.project.setEnvironmentSettings(params.environment, body, params.section);

                return new HashBrown.Http.Response('OK');
                
            case 'DELETE':
                if(!context.user.isAdmin) {
                    return new HashBrown.Http.Response('Only admins can remove environments', 403);
                }
                
                // Check if this project has this environment specified in the config
                if(request.method !== 'GET' && Array.isArray(context.config.system.projects)) {
                    for(let definition of context.config.system.projects) {
                        if(
                            definition.id !== context.project.id ||
                            !Array.isArray(definition.environments) || 
                            definition.environments.indexOf(params.environment) < 0
                        ) { continue; }
                    
                        return new HashBrown.Http.Response('This environment was defined by the server admin and cannot be deleted', 403);
                    }
                }

                await context.project.removeEnvironment(params.environment);

                return new HashBrown.Http.Response('OK');
        }
    }

    
    /**
     * Restores a backup
     *
     * @example POST /api/projects/{project}/backups/${timestamp}/restore
     */
    static async restoreBackup(request, params, body, query, context) {
        await context.project.restoreBackup(params.timestamp);

        return new HashBrown.Http.Response('OK');
    }
  
    /**
     * Creates a new backup
     *
     * @example POST /api/projects/{project}/backups/new
     */
    static async newBackup(request, params, body, query, context) {
        let timestamp = await context.project.createBackup();

        return new HashBrown.Http.Response(timestamp);
    }


    /**
     * Modifies a backup
     *
     * @example GET|DELETE /api/projects/{project}/backups/${timestamp}
     */
    static async backup(request, params, body, query, context) {
        let path = Path.join(APP_ROOT , 'storage', params.project, 'dump', params.timestamp + '.hba');
        
        switch(request.method) {
            case 'GET':
                let data = await HashBrown.Service.FileService.read(path);

                return new HashBrown.Http.Response(data, 200, {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': `attachment; filename="${params.timestamp}.hba"`
                });

            case 'DELETE':
                await HashBrown.Service.FileService.remove(path);

                return new HashBrown.Http.Response('OK');
        }

        return new HashBrown.Http.Response('Unexpected error', 500);
    }
    
    /**
     * Uploads a new backup
     *
     * @example POST /api/projects/{project}/backups/upload
     */
    static async uploadBackup(request, params, body, query, context) {
        if(!body.files || !body.files[0] || !body.files[0].filename || !body.files[0].base64) {
            return new HashBrown.Http.Response('File was not provided', 400);
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
        
        return new HashBrown.Http.Response(timestamp);
    } 

    /**
     * Lists all users for a project
     *
     * @example GET /api/projects/{project}/users
     */
    static async users(request, params, body, query, context) {
        let users = await context.project.getUsers();
    
        return new HashBrown.Http.Response(users, 200, { 'Cache-Control': 'no-store' });
    }
}

module.exports = ProjectController;
