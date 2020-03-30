'use strict';

const FileSystem = require('fs');
const Path = require('path');

/**
 * The media controller
 *
 * @memberof HashBrown.Server.Controller
 */
class MediaController extends HashBrown.Controller.ResourceController {
    static get category() { return 'media'; }

    /**
     * @example GET /api/${project}/${environment}/media/${id}
     * @example POST /api/${project}/${environment}/media/${id} { folder: XXX, filename: XXX, full: XXX, thumbnail: XXX }
     * @example DELETE /api/${project}/${environment}/media/${id}
     */
    static async resource(request, params, body, query, user) {
        if(request.method !== 'POST') {
            return await super.resource(request, params, body, query, user);
        }
        
        let media = await HashBrown.Entity.Resource.Media.get(params.project, params.environment, params.id);

        if(!media) {
            return new HttpResponse('Not found', 404);
        }

        media.adopt(body);
        
        let options = {
            full: body.full,
            filename: body.filename,
            thumbnail: body.thumbnail
        };

        await media.save(user, params.project, params.environment, options);

        return new HttpResponse('OK', 200);
    }
    
    /**
     * @example POST /api/${project}/${environment}/media/new { folder: XXX, filename: XXX, full: XXX }
     */
    static async new(request, params, body, query, user) {
        let options = {
            filename: body.filename,
            full: body.full
        };

        let media = await HashBrown.Entity.Resource.Media.create(
            user,
            params.project,
            params.environment,
            body,
            options
        );

        return new HttpResponse(media);
    }
}

module.exports = MediaController;
