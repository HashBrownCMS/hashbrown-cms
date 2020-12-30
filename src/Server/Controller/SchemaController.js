'use strict';

/**
 * The controller for schema
 *
 * @memberof HashBrown.Server.Controller
 */
class SchemaController extends HashBrown.Controller.ResourceController {
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
            ...super.routes
        };
    }

    /**
     * @example GET /api/${project}/${environment}/schemas/icons
     */
    static async icons(request, params, body, query, context) {
        let schemas = await HashBrown.Entity.Resource.SchemaBase.list(context);
        let icons = {};

        for(let schema of schemas) {
            icons[schema.id] = schema.icon;
        }

        return new HashBrown.Http.Response(icons);
    }
    
    /**
     * @example POST /api/${project}/${environment}/schemas/{$id}/pull
     *
     * @return {Object} The pulled resource
     */
    static async pull(request, params, body, query, context) {
        // Clear publication cache
        let publications = await HashBrown.Entity.Resource.Publication.list(context);

        for(let publication of publications) {
            await publication.clearCache();
        }

        return await super.pull(request, params, body, query, context);
    }
    
    /**
     * @example GET|POST|DELETE /api/${project}/${environment}/schemas/${id}?create=true|false
     */
    static async resource(request, params, body, query, context) {
        // Clear publication cache
        if(request.method === 'POST' || request.method === 'DELETE') {
            let publications = await HashBrown.Entity.Resource.Publication.list(context);

            for(let publication of publications) {
                await publication.clearCache();
            }
        }

        return await super.resource(request, params, body, query, context);
    }
}

module.exports = SchemaController;
