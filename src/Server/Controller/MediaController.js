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
     * @example POST /api/${project}/${environment}/media/${id} { folder: XXX, filename: XXX, files: [ { filename: XXX, base64: XXX } ] }
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

        media.filename = body.filename || media.filename;
        media.folder = body.folder || media.folder;
        
        let options = {};

        if(body.files && body.files[0]) {
            let file = body.files[0];

            media.filename = file.filename;
            options.base64 = file.base64;
        }

        await media.save(user, params.project, params.environment, options);

        return new HttpResponse('OK', 200);
    }
    
    /**
     * @example POST /api/${project}/${environment}/media/new { folder: XXX, files: [ { filename: XXX, base64: XXX } ] }
     */
    static async new(request, params, body, query, user) {
        let resources = [];

        for(let file of body.files || []) {
            let media = await HashBrown.Entity.Resource.Media.create(
                user,
                params.project,
                params.environment,
                {
                    filename: file.filename
                },
                {
                    base64: file.base64
                }
            );

            resources.push(media);
        }

        return new HttpResponse(resources);
    }
}

module.exports = MediaController;
