'use strict';

const Path = require('path');

/**
 * The controller for dashboard related operations
 *
 * @memberof HashBrown.Server.Controller
 */
class ServerController extends HashBrown.Controller.ControllerBase {
    /**
     * Routes
     */
    static get routes() {
        return {
            '/api/server/update/check': {
                handler: this.updateCheck,
                user: true
            }
        }
    }
        
    /**
     * Checks for new updates
     */
    static async updateCheck(request, params, body, query, user) {
        let gitTags = await HashBrown.Service.AppService.exec('git ls-remote --tags');

        gitTags = (gitTags || '').match(/v([0-9.]+)/g);

        if(!gitTags || !Array.isArray(gitTags) || gitTags.length < 1) {
            return new HttpResponse('Could not fetch remote version information', 500);
        }

        let remoteVersion = gitTags.pop().replace(/[^0-9.]/g, '').split('.');
        let localVersion = (require(APP_ROOT + '/package.json').version || '').replace(/[^0-9.]/g, '').split('.');

        if(remoteVersion.length !== 3 || localVersion.length !== 3) {
            return new HttpResponse('Could not compare versions', 500);
        }

        let isBehind = 
            (localVersion[0] < remoteVersion[0]) ||
            (localVersion[0] <= remoteVersion[0] && localVersion[1] < remoteVersion[1]) ||
            (localVersion[1] <= remoteVersion[1] && localVersion[2] < remoteVersion[2]);

        let check = {
            isBehind: isBehind,
            remoteVersion: remoteVersion.join('.'),
            localVersion: localVersion.join('.')
        };

        return new HttpResponse(check);
    }
}

module.exports = ServerController;
