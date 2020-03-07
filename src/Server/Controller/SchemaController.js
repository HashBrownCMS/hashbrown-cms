'use strict';

const Url = require('url');

/**
 * The controller for schema
 *
 * @memberof HashBrown.Server.Controller
 */
class SchemaController extends HashBrown.Controller.ResourceController {
    static get category() { return 'schemas'; }

    /**
     * Routes
     */
    static get routes() {
        return {
            ...super.routes,
            '/api/${project}/${environment}/schemas/import': {
                handler: this.import,
                user: {
                    scope: 'schemas'
                }
            }
        };
    }

    /**
     * @example POST /api/${project}/${environment}/schemas/import?url=XXX
     */
    static async import(request, params, body, query, user) {
        if(!query.url) {
            return new HttpResponse('URL was not provided', 400);
        }

        let url = query.url;

        let response = await HashBrown.Service.RequestService.request('get', url);

        if(!response) {
            return new HttpResponse('Response from web server was empty', 404);
        }
        
        if(Array.isArray(response)) {
            // Sort schemas without parents first, to avoid dependency exceptions
            response.sort((a, b) => {
                if(!a['@parent'] || a['@parent'] === 'WebPageElement') { return -1; }     
                if(!b['@parent']) { return 1; }

                return 0;
            });

            for(let json of response) {
                await HashBrown.Service.SchemaService.importSchema(params.project, params.environment, json);
            }
        } else {
            await HashBrown.Service.SchemaService.importSchema(params.project, params.environment, response);
        }

        return new HttpResponse('OK');
    }
}

module.exports = SchemaController;
