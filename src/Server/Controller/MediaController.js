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
     * @example POST /api/${project}/${environment}/media/${id} { filename: XXX, base64: XXX }
     * @example DELETE /api/${project}/${environment}/media/${id}
     */
    static async resource(request, params, body, query, user) {
        await super.resource(request, params, body, query, user);
    }
    
    /**
     * @example POST /api/${project}/${environment}/media/new { files: [ { filename: XXX, base64: XXX }, ... ] }
     */
    static async new(request, params, body, query, user) {
        let resources = [];

        for(let file of body.files) {
            let media = await HashBrown.Entity.Resource.Media.create(params.project, params.environment, {}, file);

            resources.push(media);
        }

        return new HttpResponse(resources);
    }
}

module.exports = MediaController;
