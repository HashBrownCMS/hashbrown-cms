'use strict';

const Path = require('path');

/**
 * The controller for publications
 *
 * @memberof HashBrown.Server.Controller
 */
class PublicationController extends HashBrown.Controller.ResourceController {
    static get category() { return 'publications'; }
    
    /**
     * Routes
     */
    static get routes() {
        return {
            '/api/${project}/${environment}/publications/${id}/query': {
                handler: this.query
            },
            ...super.routes,
        };
    }        
    
    /**
     * @example GET /api/${project}/${environment}/publications/${id}/query[?key=value]
     */
    static async query(request, params, body, query, user) {
        let publication = await HashBrown.Entity.Resource.Publication.get(params.project, params.environment, params.id);

        if(!publication) { return new HttpResponse('Publication not found', 404); }

        let results = await publication.getContent(query);

        return new HttpResponse(results, 200, { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' });
    }
}

module.exports = PublicationController;
