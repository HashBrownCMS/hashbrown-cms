'use strict';

const FileSystem = require('fs');
const Path = require('path');

/**
 * The media controller
 *
 * @memberof HashBrown.Server.Controller
 */
class MediaController extends HashBrown.Controller.ResourceController {
    /**
     * Routes
     */
    static get routes() {
        return {
            '/api/${project}/${environment}/media/renameFolder': {
                handler: this.renameFolder,
                methods: [ 'POST' ]
            },
            ...super.routes,
        };
    }        
    
    /**
     * @example POST /api/${project}/environment/media/renameFolder?from=XXX&to=XXX { from: XXX, to: XXX }
     */
    static async renameFolder(request, params, body, query, context) {
        let from = query.from || body.from;
        let to = query.to || body.to;

        if(!from && !to) {
            return new HashBrown.Http.Response('Parameters "from" and "to" are required', 400);
        }

        from = '/' + from.split('/').filter(Boolean).join('/');
        to = '/' + to.split('/').filter(Boolean).join('/');
       
        let toParts = to.split('/').filter(Boolean);

        let resources = await HashBrown.Entity.Resource.Media.list(context); 

        for(let resource of resources) {
            if(!resource.folder || !resource.folder.startsWith(from)) { continue; }

            let fromParts = resource.folder.split('/').filter(Boolean);

            resource.folder = '';

            for(let i = 0; i < fromParts.length; i++) {
                resource.folder += '/' + (toParts[i] || fromParts[i]);
            }

            await resource.save();
        }

        return new HashBrown.Http.Response('OK', 200);
    }

    /**
     * @example GET /api/${project}/${environment}/media/${id}
     * @example POST /api/${project}/${environment}/media/${id}?create=true|false { folder: XXX, filename: XXX, full: XXX, thumbnail: XXX }
     * @example DELETE /api/${project}/${environment}/media/${id}
     */
    static async resource(request, params, body, query, context) {
        if(request.method !== 'POST') {
            return await super.resource(request, params, body, query, context);
        }
        
        let media = await HashBrown.Entity.Resource.Media.get(context, params.id);

        if(!media && !query.create) {
            return new HashBrown.Http.Response('Not found', 404);
        }

        let options = {
            full: body.full,
            filename: body.filename,
            thumbnail: body.thumbnail
        };

        if(!media) {
            media = await HashBrown.Entity.Resource.Media.create(body, options);

        } else {
            media.adopt(body);
            await media.save(options);
        
        }

        return new HashBrown.Http.Response('OK', 200);
    }
    
    /**
     * @example POST /api/${project}/${environment}/media/new { folder: XXX, filename: XXX, full: XXX }
     */
    static async new(request, params, body, query, context) {
        let options = {
            filename: body.filename,
            full: body.full
        };

        let media = await HashBrown.Entity.Resource.Media.create(context, body, options);

        return new HashBrown.Http.Response(media);
    }

    /**
     * @example GET /api/${project}/${environment}/media/settings
     */

}

module.exports = MediaController;
