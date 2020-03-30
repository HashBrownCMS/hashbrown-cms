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
            '/api/${project}/${environment}/publications/processors': {
                handler: this.processors,
                user: {
                    scope: 'publications'
                }
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

        let results = await publication.getContent(params.project, params.environment, query);
        let app = require(Path.join(APP_ROOT, 'package.json'));

        return new HttpResponse(results, 200, { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' });
    }
    
    /**
     * @example GET /api/${project}/${environment}/publications/processors
     */
    static async processors(request, params, body, query, user) {
        let processors = {};

        for(let name in HashBrown.Entity.Processor) {
            let processor = HashBrown.Entity.Processor[name];

            if(processor === HashBrown.Entity.Processor.ProcessorBase) { continue; }

            processors[processor.alias] = processor.title;
        }

        return new HttpResponse(processors);
    }
}

module.exports = PublicationController;
