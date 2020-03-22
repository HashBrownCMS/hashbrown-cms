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
}

module.exports = SchemaController;
