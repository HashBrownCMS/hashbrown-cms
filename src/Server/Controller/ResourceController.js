'use strict';

const HTTP = require('http');
const Crypto = require('crypto');

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

        let eTag = '|' + (new URLSearchParams(params).toString() || '*') + '|' + (new URLSearchParams(query).toString() || '*') + '|';

        for(let resource of resources) {
            eTag += resource.id + ':' + (resource.updatedOn || '*') + '|';
        }

        return '"' + Crypto.createHash('md5').update(eTag).digest('hex') + '"';
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

        return new HashBrown.Http.Response(resources, 200, { 'ETag': this.getETag(resources, params, query) });
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
                return new HashBrown.Http.Response(resource, 200, { 'ETag': this.getETag([ resource ], params, query) });
                
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
