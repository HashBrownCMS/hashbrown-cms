'use strict';

const FileSystem = require('fs');
const OS = require('os');
const Path = require('path');
const HTTP = require('http');
const HTTPS = require('https');
const Crypto = require('crypto');

/**
 * The controller for assets
 *
 * @memberof HashBrown.Server.Controller
 */
class AssetController extends HashBrown.Controller.ControllerBase {
    /**
     * Routes
     */
    static get routes() {
        return {
            '/css/theme.css': {
                handler: this.theme
            },
            '/media/${project}/${environment}/${id}': {
                handler: this.media,
                user: true
            }
        };
    }

    /**
     * Checks whether this controller can handle a request
     *
     * @param {HashBrown.Http.Request} request
     *
     * @return {Boolean} Can handle request
     */
    static canHandle(request) {
        checkParam(request, 'request', HashBrown.Http.Request, true);
        
        let requestPath = this.getUrl(request).pathname;

        if(requestPath.length < 2) { return false; }
        
        let publicFilePath = Path.join(APP_ROOT, 'public', requestPath);
        let publicFileExists = HashBrown.Service.FileService.exists(publicFilePath);

        return publicFileExists || super.canHandle(request);
    }

    /**
     * Gets the file path from a request
     *
     * @param {HashBrown.Http.Request} request
     *
     * @return {String} Path
     */
    static getFilePath(request) {
        checkParam(request, 'request', HashBrown.Http.Request, true);

        let requestPath = this.getUrl(request).pathname;

        return Path.join(APP_ROOT, 'public', requestPath);
    }

    /**
     * Handles a request
     *
     * @param {HashBrown.Http.Request} request
     */
    static async handle(request) {
        checkParam(request, 'request', HashBrown.Http.Request, true);
       
        let path = this.getFilePath(request);
        let stats = await HashBrown.Service.FileService.stat(path);
        let type = getMIMEType(path);

        // If file exists in the /public directory, serve it statically
        if(stats) {
            let data = HashBrown.Service.FileService.readStream(path);
            
            let eTag = path + stats.mtime;
            eTag = '"' + Crypto.createHash('md5').update(eTag).digest('hex') + '"';

            return new HashBrown.Http.Response(data, 200, { 'Content-Type': type, 'ETag': eTag });
        }

        return await super.handle(request);
    }
    
    /**
     * Serves the theme stylesheet
     */
    static async theme(request, params, body, query, context) {
        let theme = context.user && context.user.theme ? context.user.theme : 'default';
        let path = '';

        // If a theme name contains a slash, it's from a plugin
        if(theme.indexOf('/') > -1) {
            theme = theme.split('/');
            path = Path.join(APP_ROOT, 'plugins', theme[0], 'theme', theme[1] + '.css');

        // If not, it's built in
        } else {
            path = Path.join(APP_ROOT, 'theme', theme + '.css');

        }
        
        // Fall back to default theme if not found
        if(!HashBrown.Service.FileService.exists(path)) {
            path = Path.join(APP_ROOT, 'theme', 'default.css');
        }

        let data = HashBrown.Service.FileService.readStream(path);

        return new HashBrown.Http.Response(data, 200, { 'Content-Type': 'text/css' });
    }

    /**
     * Serves binary media data
     */
    static async media(request, params, body, query, context) {
        let media = await HashBrown.Entity.Resource.Media.get(params.project, params.environment, params.id);

        if(!media) {
            return new HashBrown.Http.Response('Not found', 404);
        }
            
        let isThumbnail = ('thumbnail' in query);
        let url = isThumbnail ? await media.getThumbnailUrl() : await media.getContentUrl();
        
        if(!url) {
            return new HashBrown.Http.Response('Media URL could not be resolved', 404);
        }

        let data = HashBrown.Service.FileService.readStream(url);
        let type = isThumbnail ? 'image/jpeg' : media.getContentTypeHeader();

        if(!data) {
            return new HashBrown.Http.Response('Not found', 404);
        }

        return new HashBrown.Http.Response(data, 200, { 'Content-Type': type });
    }
}

module.exports = AssetController;
