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
                user: true,
            },
            ...super.routes
        };
    }

    /**
     * Gets all schema icons in a map
     *
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
     * @inheritdoc
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
     * @inheritdoc
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
