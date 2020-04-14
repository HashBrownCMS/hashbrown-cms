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
    static async heartbeat(request, params, body, query, context) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        
        if(!model) {
            return new HashBrown.Http.Response(`No model found for category ${this.category}`, 404);
        }
        
        let resource = await model.get(context, params.id);

        if(!resource) {
            return new HashBrown.Http.Response('Not found', 404);
        }

        await resource.heartbeat();
        
        return new HashBrown.Http.Response('OK');
    }
   
    /**
     * @example POST /api/${project}/${environment}/${category}/{$id}/pull
     *
     * @return {Object} The pulled resource
     */
    static async pull(request, params, body, query, context) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        
        if(!model) {
            return new HashBrown.Http.Response(`No model found for category ${this.category}`, 404);
        }
        
        let resource = await model.get(context, params.id);
        
        if(!resource) {
            throw new HashBrown.Http.Exception('Not found', 404);
        }

        await resource.pull();

        return new HashBrown.Http.Response(resource);
    }
    
    /**
     * @example POST /api/${project}/${environment}/{category}/${id}/push
     */
    static async push(request, params, body, query, context) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        
        if(!model) {
            return new HashBrown.Http.Response(`No model found for category ${this.category}`, 404);
        }

        let resource = await model.get(context, params.id);
        
        if(!resource) {
            throw new HashBrown.Http.Exception('Not found', 404);
        }

        await resource.push();
    
        return new HashBrown.Http.Response('OK');
    }
    
    /**
     * @example GET /api/${project}/${environment}/${category}
     */
    static async resources(request, params, body, query, context) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        
        if(!model) {
            return new HashBrown.Http.Response(`No model found for category ${this.category}`, 404);
        }
        
        let resources = await model.list(context, query);

        return new HashBrown.Http.Response(resources);
    }
    
    /**
     * @example GET|POST|DELETE /api/${project}/${environment}/${category}/${id}
     */
    static async resource(request, params, body, query, context) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        
        if(!model) {
            return new HashBrown.Http.Response(`No model found for category ${this.category}`, 404);
        }
        
        let resource = await model.get(context, params.id, query);
                
        if(!resource) {
            return new HashBrown.Http.Response('Not found', 404);
        }

        switch(request.method) {
            case 'GET':
                return new HashBrown.Http.Response(resource, 200, { 'Last-Modified': (resource.updatedOn || new Date()).toString() });
                
            case 'POST':
                if(!context.user.hasScope(this.category)) {
                    return new HashBrown.Http.Response('You do not have access to edit this resource', 403);
                }

                resource.adopt(body);

                // In case the id was changed, make sure to include the old id in the options
                query.id = params.id;
                    
                await resource.save(query);
                
                return new HashBrown.Http.Response(resource);

            case 'DELETE':
                if(!context.user.hasScope(this.category)) {
                    return new HashBrown.Http.Response('You do not have access to remove this resource', 403);
                }
                
                await resource.remove(query);

                return new HashBrown.Http.Response('OK');
        }

        return new HashBrown.Http.Response('Unexpected error', 500);
    }
    
    /**
     * @example POST /api/${project}/${environment}/${category}/new
     */
    static async new(request, params, body, query, context) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        
        if(!model) {
            return new HashBrown.Http.Response(`No model found for category ${this.category}`, 404);
        }
        
        let resource = await model.create(context, body, query);

        return new HashBrown.Http.Response(resource);
    }
}

module.exports = ResourceController;
