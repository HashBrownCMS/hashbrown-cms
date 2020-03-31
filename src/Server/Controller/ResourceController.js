'use strict';

const HTTP = require('http');

/**
 * A controller for resource endpoints
 *
 * @memberof HashBrown.Server.Controller
 */
class ResourceController extends HashBrown.Controller.ControllerBase {
    static get category() {
        throw new Error('The "category" getter method must be overridden');
    }

    static get routes() {
        let routes = {};
        
        // Migration
        routes['/api/${project}/${environment}/' + this.category + '/dependencies'] = {
            handler: this.dependencies,
            user: {
                scope: this.category
            }
        };
        routes['/api/${project}/${environment}/' + this.category + '/migrate'] = {
            handler: this.migrate,
            methods: [ 'POST' ],
            user: {
                scope: this.category
            }
        };
        
        // Regular operations
        routes['/api/${project}/${environment}/' + this.category] = {
            handler: this.resources,
            user: true
        };
        routes['/api/${project}/${environment}/' + this.category + '/new'] = {
            handler: this.new,
            methods: [ 'POST' ],
            user: {
                scope: this.category
            }
        };
        routes['/api/${project}/${environment}/' + this.category + '/${id}'] = {
            handler: this.resource,
            methods: [ 'GET', 'POST', 'DELETE' ],
            user: true
        };
        
        // Sync
        routes['/api/${project}/${environment}/' + this.category + '/${id}/pull'] = {
            handler: this.pull,
            methods: [ 'POST' ],
            user: {
                scope: this.category
            }
        };
        routes['/api/${project}/${environment}/' + this.category + '/${id}/push'] = {
            handler: this.push,
            methods: [ 'POST' ],
            user: {
                scope: this.category
            }
        };

        // Heartbeat
        routes['/api/${project}/${environment}/' + this.category + '/${id}/heartbeat'] = {
            handler: this.heartbeat,
            methods: [ 'POST' ],
            user: {
                scope: this.category
            }
        };

        return routes;
    }
    
    /**
     * Resets last modified dates related to a key
     *
     * @param {String} key
     */
    static resetLastModified(key) {
        checkParam(key, 'key', String);
   
        if(!key) { return; }

        // Ignore heartbeat requests
        if(key.indexOf('/heartbeat') > -1) { return; }

        // Modify key to widen search for similar keys
        key = key.split('/' + this.category + '/').shift() + '/' + this.category;

        super.resetLastModified(key);
    }
    
    /**
     * Checks whether this controller can handle a request
     *
     * @param {HTTP.IncomingMessage} request
     *
     * @return {Boolean} Can handle request
     */
    static canHandle(request) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);

        if(this === HashBrown.Controller.ResourceController) { return false; }

        return super.canHandle(request);
    }

    /**
     * @example POST /api/${project}/${environment}/${category}/${id}/heartbeat
     */
    static async heartbeat(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        
        if(!model) {
            return new HttpResponse(`No model found for category ${this.category}`, 404);
        }
        
        let resource = await model.get(params.project, params.environment, params.id);

        if(!resource) {
            return new HttpResponse('Not found', 404);
        }

        await resource.heartbeat(user);
        
        return new HttpResponse('OK');
    }
   
    /**
     * @example POST /api/${project}/${environment}/${category}/{$id}/pull
     *
     * @return {Object} The pulled resource
     */
    static async pull(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        
        if(!model) {
            return new HttpResponse(`No model found for category ${this.category}`, 404);
        }
        
        let resource = await model.get(params.project, params.environment, params.id);
        
        await resource.pull(user);

        return new HttpResponse(resource);
    }
    
    /**
     * @example POST /api/${project}/${environment}/{category}/${id}/push
     */
    static async push(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        
        if(!model) {
            return new HttpResponse(`No model found for category ${this.category}`, 404);
        }

        let resource = await model.get(params.project, params.environment, params.id);
        
        await resource.push(user);
    
        return new HttpResponse('OK');
    }
    
    /**
     * @example GET /api/${project}/${environment}/${category}
     */
    static async resources(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        
        if(!model) {
            return new HttpResponse(`No model found for category ${this.category}`, 404);
        }
        
        let resources = await model.list(params.project, params.environment, query);

        return new HttpResponse(resources);
    }
    
    /**
     * @example GET|POST|DELETE /api/${project}/${environment}/${category}/${id}
     */
    static async resource(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        
        if(!model) {
            return new HttpResponse(`No model found for category ${this.category}`, 404);
        }
        
        let resource = await model.get(params.project, params.environment, params.id, query);
                
        if(!resource) {
            return new HttpResponse('Not found', 404);
        }

        switch(request.method) {
            case 'GET':
                return new HttpResponse(resource, 200, { 'Last-Modified': (resource.updatedOn || new Date()).toString() });
                
            case 'POST':
                if(!user.hasScope(this.category)) {
                    return new HttpResponse('You do not have access to edit this resource', 403);
                }

                resource.adopt(body);

                // In case the id was changed, make sure to include the old id in the options
                query.id = params.id;
                    
                await resource.save(user, query);
                
                return new HttpResponse(resource);

            case 'DELETE':
                if(!user.hasScope(this.category)) {
                    return new HttpResponse('You do not have access to remove this resource', 403);
                }
                
                await resource.remove(user, query);

                return new HttpResponse('OK');
        }

        return new HttpResponse('Unexpected error', 500);
    }
    
    /**
     * @example POST /api/${project}/${environment}/${category}/new
     */
    static async new(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        
        if(!model) {
            return new HttpResponse(`No model found for category ${this.category}`, 404);
        }
        
        let resource = await model.create(user, params.project, params.environment, body, query);

        return new HttpResponse(resource);
    }

    /**
     * @example GET /api/${project}/${environment}/${category}/dependencies?resources=XXX,XXX
     */
    static async dependencies(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        
        if(!model) {
            return new HttpResponse(`No model found for category ${this.category}`, 404);
        }
       
        let allDependencies = {};
        let ids = (query.resources || '').split(',');

        for(let id of ids) {
            let resource = await model.get(params.project, params.environment, id);
            let dependencies = await resource.getDependencies();

            for(let category in dependencies) {
                if(!allDependencies[category]) {
                    allDependencies[category] = [];
                }

                for(let dependency of dependencies[category]) {
                    if(allDependencies[category].indexOf(dependency) > -1) { continue; }

                    allDependencies[category].push(dependency);
                }
            }
        }

        return new HttpResponse(allDependencies);
    }
    
    /**
     * @example POST /api/${project}/${environment}/${category}/migrate { project: XXX, environment: XXX, resources: [ XXX,XXX ] }
     */
    static async migrate(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        
        if(!model) {
            return new HttpResponse(`No model found for category ${this.category}`, 404);
        }
        
        for(let id of body.resources) {
            let resource = await model.get(params.project, params.environment, params.id, query);

            await resource.migrate(body.project, body.environment);
        }

        return new HttpResponse('OK');
    }
}

module.exports = ResourceController;
