'use strict';

/**
 * Controller for Content
 *
 * @memberof HashBrown.Server.Controller
 */
class ContentController extends HashBrown.Controller.ResourceController {
    /**
     * Initialises this controller
     */
    static get routes() {
        return {
            ...super.routes,
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
     * @example POST /api/${project}/${environment}/content/${id}/insert?parentId=XXX&position=XXX
     */
    static async insert(request, params, body, query, context) {
        let resource = await HashBrown.Entity.Resource.Content.get(context, params.id);

        if(!resource) {
            return new HashBrown.Http.Response('Not found', 404);
        }

        let parent = await HashBrown.Entity.Resource.Content.get(context, query.parentId);

        await resource.insert(parent, parseInt(query.position));
        
        return new HashBrown.Http.Response('OK');
    }
}

module.exports = ContentController;
