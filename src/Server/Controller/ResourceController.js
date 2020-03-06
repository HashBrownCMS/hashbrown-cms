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
        routes['/api/${project}/${environment}/' + this.category + '/pull/${id}'] = {
            handler: this.pull,
            methods: [ 'POST' ],
            user: {
                scope: this.category
            }
        };
        routes['/api/${project}/${environment}/' + this.category + '/push/${id}'] = {
            handler: this.pull,
            methods: [ 'POST' ],
            user: {
                scope: this.category
            }
        };

        // Heartbeat
        routes['/api/${project}/${environment}/' + this.category + '/heartbeat/${id}'] = {
            handler: this.heartbeat,
            methods: [ 'POST' ],
            user: {
                scope: this.category
            }
        };

        return routes;
    }

    /**
     * @example POST /api/${project}/${environment}/content/heartbeat/${id}
     */
    static async heartbeat(request, params, body, query, user) {
        let isLocked = await HashBrown.Service.ResourceService.isResourceLocked(params.project, params.environment, this.category, params.id);

        if(isLocked) {
            return new HttpResponse('Resource is locked');
        }
        
        await HashBrown.Service.DatabaseService.updateOne(
            params.project,
            params.environment + '.' + this.category,
            {
                id: params.id
            },
            {
                viewedBy: user.id,
                viewedOn: new Date()
            }
        );

        return new HttpResponse('OK');
    }
   
    /**
     * @example POST /api/${project}/${environment}/${category}/pull/${id}
     *
     * @return {Object} The pulled resource
     */
    static async pull(request, params, body, query, user) {
        let resource = await HashBrown.Service.SyncService.getResourceItem(params.project, params.environment, this.category, params.id);
        
        if(!resource) {
            return new HttpResponse(`Could not find remote resource ${this.category}/${id}`, 404);
        }
        
        await HashBrown.Service.ResourceService.setResourceById(params.project, params.environment, this.category, id, resource, true);

        return new HttpResponse(resource);
    }
    
    /**
     * @example POST /api/${project}/${environment}/{category}/push/${id}
     */
    static async push(request, params, body, query, user) {
        let localResource = await HashBrown.Service.ResourceService.getResourceById(params.project, params.environment, params.id, true);

        await HashBrown.Service.SyncService.setResourceItem(req.project, req.environment, this.category, params.id, localResource);
    
        return new HttpResponse('OK');
    }
    
    /**
     * @example GET /api/${project}/${environment}/${category}
     */
    static async resources(request, params, body, query, user) {
        let resources = await HashBrown.Service.ResourceService.getAllResources(params.project, params.environment, this.category);

        return new HttpResponse(resources);
    }
    
    /**
     * @example GET|POST|DELETE /api/${project}/${environment}/${category}/${id}
     */
    static async resource(request, params, body, query, user) {
        switch(request.method) {
            case 'GET':
                let result = await HashBrown.Service.ResourceService.getResourceById(params.project, params.environment, this.category, params.id);

                if(!result) {
                    return new HttpResponse('Not found', 404);
                }

                return new HttpResponse(result);
                
            case 'POST':
                let updated = await HashBrown.Service.ResourceService.setResourceById(params.project, params.environment, this.category, params.id, body);
                
                return new HttpResponse(updated);

            case 'DELETE':
                await HashBrown.Service.ResourceService.removeResourceById(params.project, params.environment, this.category, params.id);

                return new HttpResponse('OK');
        }

        return new HttpResponse('Unexpected error', 500);
    }
    
    /**
     * @example POST /api/${project}/${environment}/${category}/new
     */
    static async new(request, params, body, query, user) {
        let resource = await HashBrown.Service.ResourceService.createResource(params.project, params.environment, this.category, body);

        return new HttpResponse(resource);
    }
}

module.exports = ResourceController;
