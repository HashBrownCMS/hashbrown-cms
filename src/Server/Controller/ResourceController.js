'use strict';

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
            user: {
                scope: this.category
            }
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
            user: {
                scope: this.category
            }
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
            handler: this.pull,
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
     * @example POST /api/${project}/${environment}/${category}/${id}/heartbeat
     */
    static async heartbeat(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        let resource = await model.get(params.project, params.environment, params.id);

        await resource.heartbeat();
        
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
        
        await resource.pull(params.project, params.environment);

        return new HttpResponse(resource);
    }
    
    /**
     * @example POST /api/${project}/${environment}/{category}/${id}/push
     */
    static async push(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        let resource = await model.get(params.project, params.environment, params.id);
        
        await resource.push(params.project, params.environment);
    
        return new HttpResponse('OK');
    }
    
    /**
     * @example GET /api/${project}/${environment}/${category}
     */
    static async resources(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        let resources = await model.list(params.project, params.environment, query);

        return new HttpResponse(resources);
    }
    
    /**
     * @example GET|POST|DELETE /api/${project}/${environment}/${category}/${id}
     */
    static async resource(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        let resource = null;

        switch(request.method) {
            case 'GET':
                resource = await model.get(params.project, params.environment, params.id, query);
                
                if(!resource) {
                    return new HttpResponse('Not found', 404);
                }
                
                return new HttpResponse(resource);
                
            case 'POST':
                resource = await model.get(params.project, params.environment, params.id, query);
                
                if(!resource) {
                    return new HttpResponse('Not found', 404);
                }
                
                resource.adopt(body);
                    
                await resource.save(params.project, params.environment, query);
                
                return new HttpResponse(updated);

            case 'DELETE':
                resource = await model.get(params.project, params.environment, params.id, query);
                
                if(!resource) {
                    return new HttpResponse('Not found', 404);
                }
                
                await resource.remove(params.project, params.environment, query);

                return new HttpResponse('OK');
        }

        return new HttpResponse('Unexpected error', 500);
    }
    
    /**
     * @example POST /api/${project}/${environment}/${category}/new
     */
    static async new(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        let resource = await model.create(params.project, params.environment, body, query);

        return new HttpResponse(resource);
    }
}

module.exports = ResourceController;
