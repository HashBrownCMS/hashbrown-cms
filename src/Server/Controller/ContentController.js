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
            '/api/${project}/${environment}/content/insert': {
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
     * @example GET|POST|DELETE /api/${project}/${environment}/content/${id}
     */
    static async resource(request, params, body, query, user) {
        switch(request.method) {
            case 'GET':
                let result = await HashBrown.Service.ContentService.getContentById(params.project, params.environment, params.id);

                return new HttpResponse(result);

            case 'POST':
                let updated = await HashBrown.Service.ContentService.setContentById(params.project, params.environment, params.id, body, user);
                
                return new HttpResponse(updated);
            
            case 'DELETE':
                return new HttpResponse('OK');
        }

        return new HttpResponse('Unexpected error', 500);
    }
    
    /**
     * @example POST /api/${project}/${environment}/content/new?parentId=XXX&schemaId=XXX
     */
    static async new(request, params, body, query, user) {
        let parentId = query.parentId;
        let schemaId = query.schemaId;
        let properties = body;

        // Sanity check for properties
        if(properties.properties) {
            properties = properties.properties;
        }
        
        let content = await HashBrown.Service.ContentService.createContent(params.project, params.environment, schemaId, parentId, user, properties);

        return new HttpResponse(content);
    }

    /**
     * @example POST /api/${project}/${environment}/content/insert?contentId=XXX&parentId=XXX&position=XXX
     */
    static async insert(request, params, body, query, user) {
        await HashBrown.Service.ContentService.insertContent(params.project, params.environment, user, query.contentId, query.parentId, parseInt(query.position));
        
        return new HttpResponse('OK');
    }
}

module.exports = ContentController;
