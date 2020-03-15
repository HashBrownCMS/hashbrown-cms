'use strict';

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
            '/api/${project}/${environment}/schemas/icons': {
                handler: this.icons,
                user: {
                    scope: 'schemas'
                }
            },
            '/api/${project}/${environment}/schemas/import': {
                handler: this.import,
                methods: [ 'POST' ],
                user: {
                    scope: 'schemas'
                }
            },
            ...super.routes
        };
    }

    /**
     * @example GET /api/${project}/${environment}/schemas/icons
     */
    static async icons(request, params, body, query, user) {
        let schemas = await HashBrown.Entity.Resource.SchemaBase.list(params.project, params.environment);
        let icons = {};

        for(let schema of schemas) {
            icons[schema.id] = schema.icon;
        }

        return new HttpResponse(icons);
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
                await HashBrown.Entity.Resource.SchemaBase.import(user, params.project, params.environment, json);
            }
        } else {
            await HashBrown.Entity.Resource.SchemaBase.import(user, params.project, params.environment, response);
        }

        return new HttpResponse('OK');
    }
}

module.exports = SchemaController;
