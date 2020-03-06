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

    /**
     * @example GET /api/${project}/${environment}/schemas?customOnly=true|false
     */
    static async resources(request, params, body, query, user) {
        let schemas = [];

        if(query.customOnly) {
            schemas = await HashBrown.Service.SchemaService.getCustomSchemas(params.project, params.environment);
        
        } else {
            schemas = await HashBrown.Service.SchemaService.getAllSchemas(params.project, params.environment);
        
        }

        return new HttpResponse(schemas);
    }
    
    /**
     * @example GET|POST|DELETE /api/${project}/${environment}/schemas/${id}
     */
    static async resource(request, params, body, query, user) {
        switch(request.method) {
            case 'GET':
                let result = await HashBrown.Service.SchemaService.getSchemaById(params.project, params.environment, params.id);

                if(!result) {
                    return new HttpResponse('Not found', 404);
                }

                return new HttpResponse(result);
                
            case 'POST':
                let updated = await HashBrown.Service.SchemaService.setSchemaById(params.project, params.environment, params.id, body);
                
                return new HttpResponse(updated);

            case 'DELETE':
                await HashBrown.Service.ResourceService.removeSchemaById(params.project, params.environment, params.id);

                return new HttpResponse('OK');
        }

        return new HttpResponse('Unexpected error', 500);
    }
    
    /**
     * @example POST /api/:project/:environment/schemas/new?parentSchemaId=XXX
     */
    static async new(request, params, body, query, user) {
        let schema = await HashBrown.Service.SchemaService.createSchema(params.project, params.environment, query.parentSchemaId);

        return new HttpResponse(schema);
    }
}

module.exports = SchemaController;
