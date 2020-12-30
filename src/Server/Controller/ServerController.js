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
    static async updateCheck(request, params, body, query, context) {
        let gitTags = '';
        
        try {
            gitTags = await HashBrown.Service.AppService.exec('git ls-remote --tags');

        } catch(e) {
            return new HashBrown.Http.Response('Could not fetch remote version information: ' + (e.message || 'Unknown error'), 500);
        
        }

        gitTags = (gitTags || '').match(/v([0-9.]+)/g);

        if(!gitTags || !Array.isArray(gitTags) || gitTags.length < 1) {
            return new HashBrown.Http.Response('Could not fetch remote version information', 500);
        }

        let localVersion = require(APP_ROOT + '/package.json').version || '';
        let remoteVersion = gitTags.pop();

        let check = {
            isBehind: semver(localVersion, remoteVersion) < 0,
            remoteVersion: remoteVersion.join('.'),
            localVersion: localVersion.join('.')
        };

        return new HashBrown.Http.Response(check);
    }
}

module.exports = ServerController;
