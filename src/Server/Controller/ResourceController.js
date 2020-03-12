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
        let resource = await model.get(params.project, params.environment, params.id);

        if(!resource) {
            return new HttpResponse('Not found', 404);
        }

        await resource.heartbeat(params.project, params.environment, user);
        
        return new HttpResponse('OK');
    }
   
    /**
     * @example POST /api/${project}/${environment}/${category}/{$id}/pull
     *
     * @return {Object} The pulled resource
     */
    static async pull(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        let resource = await model.get(params.project, params.environment, params.id);
        
        await resource.pull(user, params.project, params.environment);

        return new HttpResponse(resource);
    }
    
    /**
     * @example POST /api/${project}/${environment}/{category}/${id}/push
     */
    static async push(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        let resource = await model.get(params.project, params.environment, params.id);
        
        await resource.push(user, params.project, params.environment);
    
        return new HttpResponse('OK');
    }
    
    /**
     * @example GET /api/${project}/${environment}/${category}
     */
    static async resources(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        let resources = await model.list(params.project, params.environment, query);

        return new HttpResponse(resources, 200, { 'Cache-Control': 'no-store' });
    }
    
    /**
     * @example GET|POST|DELETE /api/${project}/${environment}/${category}/${id}
     */
    static async resource(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        let resource = await model.get(params.project, params.environment, params.id, query);
                
        if(!resource) {
            return new HttpResponse('Not found', 404);
        }

        switch(request.method) {
            case 'GET':
                return new HttpResponse(resource);
                
            case 'POST':
                if(!user.hasScope(this.category)) {
                    return new HttpResponse('You do not have access to edit this resource', 403);
                }

                resource.adopt(body);
                    
                await resource.save(user, params.project, params.environment, query);
                
                return new HttpResponse(resource);

            case 'DELETE':
                if(!user.hasScope(this.category)) {
                    return new HttpResponse('You do not have access to remove this resource', 403);
                }
                
                await resource.remove(user, params.project, params.environment, query);

                return new HttpResponse('OK');
        }

        return new HttpResponse('Unexpected error', 500);
    }
    
    /**
     * @example POST /api/${project}/${environment}/${category}/new
     */
    static async new(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        let resource = await model.create(user, params.project, params.environment, body, query);

        return new HttpResponse(resource);
    }
}

module.exports = ResourceController;
