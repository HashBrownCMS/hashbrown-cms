'use strict';

const HTTP = require('http');
const Crypto = require('crypto');

/**
 * A controller for resource endpoints
 *
 * @memberof HashBrown.Server.Controller
 */
class ResourceController extends HashBrown.Controller.ControllerBase {
    static get routes() {
        let routes = {};
        
        // Regular operations
        routes['/api/${project}/${environment}/' + this.library] = {
            handler: this.resources,
            user: true
        };
        routes['/api/${project}/${environment}/' + this.library + '/new'] = {
            handler: this.new,
            methods: [ 'POST' ],
            user: {
                scope: this.library
            }
        };
        routes['/api/${project}/${environment}/' + this.library + '/${id}'] = {
            handler: this.resource,
            methods: [ 'GET', 'POST', 'DELETE' ],
            user: true
        };
        
        // Sync
        routes['/api/${project}/${environment}/' + this.library + '/${id}/pull'] = {
            handler: this.pull,
            methods: [ 'POST' ],
            user: {
                scope: this.library
            }
        };
        routes['/api/${project}/${environment}/' + this.library + '/${id}/push'] = {
            handler: this.push,
            methods: [ 'POST' ],
            user: {
                scope: this.library
            }
        };

        // Heartbeat
        routes['/api/${project}/${environment}/' + this.library + '/${id}/heartbeat'] = {
            handler: this.heartbeat,
            methods: [ 'POST' ],
            user: {
                scope: this.library
            }
        };

        return routes;
    }
    
    /**
     * Checks whether this controller can handle a request
     *
     * @param {HashBrown.Http.Request} request
     *
     * @return {Boolean} Can handle request
     */
    static canHandle(request) {
        checkParam(request, 'request', HashBrown.Http.Request, true);

        if(this === HashBrown.Controller.ResourceController) { return false; }

        return super.canHandle(request);
    }
i
    /**
     * Gets the ETag for a list of resources
     *
     * @param {Array} resources
     * @param {Object} params
     * @param {Object} query
     *
     * @return {String} ETag
     */
    static getETag(resources, params, query) {
        checkParam(resources, 'resources', Array, true);
        checkParam(params, 'params', Object, true);
        checkParam(query, 'query', Object, true);

        let eTag = '|' + APP_STARTED + '|' + (new URLSearchParams(params).toString() || '*') + '|' + (new URLSearchParams(query).toString() || '*') + '|';

        for(let resource of resources) {
            eTag += resource.id + ':' + (resource.updatedOn || '*') + '|';
        }

        return '"' + Crypto.createHash('md5').update(eTag).digest('hex') + '"';
    }

    /**
     * Updates the resource with information about who is viewing it
     */
    static async heartbeat(request, params, body, query, context) {
        let model = HashBrown.Service.LibraryService.getClass(this.library, HashBrown.Entity.Resource.ResourceBase);
        
        if(!model) {
            return new HashBrown.Http.Response(`No model found for library ${this.library}`, 404);
        }
        
        let resource = await model.get(context, params.id);

        if(!resource) {
            return new HashBrown.Http.Response('Not found', 404);
        }

        await resource.heartbeat();
        
        return new HashBrown.Http.Response('OK');
    }
   
    /**
     * Pulls a resource from a synced instance
     *
     * @example POST /api/${project}/${environment}/${library}/{$id}/pull
     *
     * @return {Object} The pulled resource
     */
    static async pull(request, params, body, query, context) {
        let model = HashBrown.Service.LibraryService.getClass(this.library, HashBrown.Entity.Resource.ResourceBase);
        
        if(!model) {
            return new HashBrown.Http.Response(`No model found for library ${this.library}`, 404);
        }
        
        let resource = await model.get(context, params.id);
        
        if(!resource) {
            throw new HashBrown.Http.Exception('Not found', 404);
        }

        await resource.pull();

        return new HashBrown.Http.Response(resource);
    }
    
    /**
     * Pushes a resource to a synced instance
     *
     * @example POST /api/${project}/${environment}/{library}/${id}/push
     */
    static async push(request, params, body, query, context) {
        let model = HashBrown.Service.LibraryService.getClass(this.library, HashBrown.Entity.Resource.ResourceBase);
        
        if(!model) {
            return new HashBrown.Http.Response(`No model found for library ${this.library}`, 404);
        }

        let resource = await model.get(context, params.id);
        
        if(!resource) {
            throw new HashBrown.Http.Exception('Not found', 404);
        }

        await resource.push();
    
        return new HashBrown.Http.Response('OK');
    }
    
    /**
     * Lists all resources
     *
     * @example GET /api/${project}/${environment}/${library}
     */
    static async resources(request, params, body, query, context) {
        let model = HashBrown.Service.LibraryService.getClass(this.library, HashBrown.Entity.Resource.ResourceBase);
        
        if(!model) {
            return new HashBrown.Http.Response(`No model found for library ${this.library}`, 404);
        }
        
        let resources = await model.list(context, query);

        return new HashBrown.Http.Response(resources, 200, { 'ETag': this.getETag(resources, params, query) });
    }
    
    /**
     * Modifies a single resource
     *
     * @example GET|POST|DELETE /api/${project}/${environment}/${library}/${id}?create=true|false
     */
    static async resource(request, params, body, query, context) {
        let model = HashBrown.Service.LibraryService.getClass(this.library, HashBrown.Entity.Resource.ResourceBase);
        
        if(!model) {
            return new HashBrown.Http.Response(`No model found for library ${this.library}`, 404);
        }
        
        let resource = await model.get(context, params.id, query);
                
        if(!resource && !query.create) {
            return new HashBrown.Http.Response('Not found', 404);
        }

        switch(request.method) {
            case 'GET':
                return new HashBrown.Http.Response(resource, 200, { 'ETag': this.getETag([ resource ], params, query) });
                
            case 'POST':
                if(!context.user.hasScope(context.project.id, this.library)) {
                    return new HashBrown.Http.Response(`You do not have access to edit this ${this.library} resource`, 403);
                }

                if(!resource) {
                    resource = await model.create(context, body, query);

                } else {
                    resource.adopt(body);
                    
                    query.id = params.id; // Include the original id, in case it was changed
                    
                    await resource.save(query);
                }
                
                return new HashBrown.Http.Response(resource);

            case 'DELETE':
                if(!context.user.hasScope(context.project.id, this.library)) {
                    return new HashBrown.Http.Response(`You do not have access to remove this ${this.library} resource`, 403);
                }
                
                await resource.remove(query);

                return new HashBrown.Http.Response('OK');
        }

        return new HashBrown.Http.Response('Unexpected error', 500);
    }
    
    /**
     * Creates a new resource
     *
     * @example POST /api/${project}/${environment}/${library}/new
     */
    static async new(request, params, body, query, context) {
        let model = HashBrown.Service.LibraryService.getClass(this.library, HashBrown.Entity.Resource.ResourceBase);
        
        if(!model) {
            return new HashBrown.Http.Response(`No model found for library ${this.library}`, 404);
        }
        
        let resource = await model.create(context, body, query);

        return new HashBrown.Http.Response(resource);
    }
}

module.exports = ResourceController;
