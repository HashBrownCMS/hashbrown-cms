'use strict';

/**
 * Controller for Content
 *
 * @memberof HashBrown.Server.Controller
 */
class ContentController extends HashBrown.Controller.ResourceController {
    static get category() { return 'content'; }

    /**
     * Initialises this controller
     */
    static get routes() {
        return {
            ...super.routes,
            '/api/${project}/${environment}/content/example': {
                handler: this.example,
                methods: [ 'POST' ],
                user: {
                    scope: 'content'
                }
            },
            '/api/${project}/${environment}/content/${id}/insert': {
                handler: this.insert,
                methods: [ 'POST' ],
                user: {
                    scope: 'content'
                }
            }
        };
    }
  
    /**
     * @example POST /api/${project}/${environment}/content/example
     */
    static async example(request, params, body, query, user) {
        await HashBrown.Service.ContentService.createExampleContent(params.project, params.environment, user);
            
        return new HttpResponse('OK');
    }

    /**
     * @example POST /api/${project}/${environment}/content/${id}/insert?parentId=XXX&position=XXX
     */
    static async insert(request, params, body, query, user) {
        let resource = await HashBrown.Entity.Resource.Content.get(params.project, params.environment, params.id);

        if(!resource) {
            return new HttpResponse('Not found', 404);
        }

        await resource.insert(params.project, params.environment, query.parentId, parseInt(query.position), user);
        
        return new HttpResponse('OK');
    }
}

module.exports = ContentController;
