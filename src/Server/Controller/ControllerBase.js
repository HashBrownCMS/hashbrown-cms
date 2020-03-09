'use strict';

const HTTP = require('http');
const QueryString = require('querystring');
const Url = require('url');

const MAX_UPLOAD_SIZE = 20e6;

/**
 * The base class for all controllers
 *
 * @memberof HashBrown.Server.Controller
 */
class ControllerBase {
    /**
     * Checks whether this controller can handle a request
     *
     * @param {HTTP.IncomingMessage} request
     *
     * @return {Boolean} Can handle request
     */
    static canHandle(request) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);

        return !!this.getRoute(request);
    }

    /**
     * Gets a route definition
     *
     * @param {HTTP.IncomingMessage} request
     *
     * @return {Object} Route definition
     */
    static getRoute(request) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);

        let requestPath = Url.parse(request.url, true).path;
        let route = null;

        // First test for exact matches
        for(let pattern in this.routes) {
            if(pattern !== requestPath) { continue; }

            route = this.routes[pattern];
            route.pattern = pattern;
            break;
        }

        // Then test for regex matches
        if(!route) {
            for(let pattern in this.routes) {
                let patternHasVariables = pattern.indexOf('${') > -1;
                let patternMatchesRequestPathLength = pattern.split('/').length === requestPath.split('/').length;
                let routeSupportsRequestMethod = (request.method === 'GET' && !this.routes[pattern].methods) || (this.routes[pattern].methods && this.routes[pattern].methods.indexOf(request.method) > -1);
                
                if(!patternHasVariables || !patternMatchesRequestPathLength || !routeSupportsRequestMethod) { continue; }

                let regex = new RegExp(pattern.replace(/\${([^}]+)}/g, '([^\/]+)'));
                
                if(!regex.test(requestPath)) { continue; }

                route = this.routes[pattern];
                route.pattern = pattern;
                break;
            }
        }

        // Perform sanity check
        if(route) {
            if(!route.methods || !Array.isArray(route.methods)) {
                route.methods = [ 'GET' ];
            }
        }

        return route;
    }

    /**
     * Parses a request path and route pattern into a parameters object
     *
     * @param {String} path
     * @param {String} pattern
     *
     * @return {Object} Parameters
     */
    static getRequestParameters(path, pattern) {
        checkParam(path, 'path', String);
        checkParam(pattern, 'pattern', String);

        if(!path || !pattern) { return {}; }

        let pathParts = path.split('/');
        let patternParts = pattern.split('/');
            
        let params = {};
                
        for(let i in pathParts) {
            let match = (patternParts[i] || '').match(/\${([^}]+)}/);

            if(!match || !match[1]) { continue; }
            
            let key = match[1];
            let value = pathParts[i];

            params[key] = value;
        }

        return params;
    }

    /**
     * Handles a request
     *
     * @param {HTTP.IncomingMessage} request
     */
    static async handle(request) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);
       
        let requestPath = Url.parse(request.url, true).path;
        let route = this.getRoute(request);

        if(!route) {
            return new HttpResponse('Not found', 404);
        }
       
        if(typeof route.redirect === 'string') {
            return new HttpResponse(`You are being redirected to ${route.redirect}...`, 302, { 'Location': route.redirect });
        }

        if(typeof route.handler !== 'function') {
            return new HttpResponse(`Handler for route ${requestPath} is not a function`, 500);
        }

        // Check for allowed methods
        if(route.methods.indexOf(request.method) < 0) {
            return new HttpResponse(`Route ${route.pattern} does not support method ${request.method}`, 405);
        }

        // Get request parameters
        let requestParameters = this.getRequestParameters(requestPath, route.pattern);

        // 3 levels of user auth
        let user = null;

        if(route.user === true) {
            user = await this.authorize(request, requestParameters.project);
        
        } else if(typeof route.user === 'object') {
            user = await this.authorize(request, requestParameters.project, route.user.scope, route.user.isAdmin);
        
        } else {
            user = await this.authenticate(request, true);

        }

        // Validate project
        if(requestParameters.project) {
            let projectExists = await HashBrown.Service.ProjectService.projectExists(requestParameters.project);

            if(!projectExists) {
                return new HttpResponse(`Project "${requestParameters.project}" could not be found`, 404);
            }

            // Validate environment
            if(requestParameters.environment) {
                let environmentExists = await HashBrown.Service.ProjectService.environmentExists(requestParameters.project, requestParameters.environment);

                if(!environmentExists) {
                    return new HttpResponse(`Environment "${requestParameters.environment}" was not found for project "${requestParameters.project}"`, 404);
                }
            }
        }

        // Read request body
        let requestBody = await this.getRequestBody(request);
        let requestQuery = Url.parse(request.url, true).query || {};

        let response = await route.handler.call(this, request, requestParameters, requestBody, requestQuery, user);

        if(response instanceof HttpResponse === false) {
            return new HttpResponse('Response was not of type HttpResponse', 500);
        }

        return response;
    }

    /**
     * Handles an error
     *
     * @param {Error} error
     *
     * @return {HttpResponse} Response
     */
    static error(error) {
        checkParam(error, 'error', Error, true);
        
        return new HttpResponse(error.stack || error.message, error.code || 500, { 'Content-Type': 'text/plain' });
    }

    /**
     * Gets the body of a request
     *
     * @param {HTTP.IncomingMessage} request
     * @param {Boolean} asBuffer
     *
     * @return {Object|Buffer} Body
     */
    static getRequestBody(request, asBuffer = false) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);
        checkParam(asBuffer, 'asBuffer', Boolean);

        return new Promise((resolve, reject) => {
            let body = '';

            request.on('data', (data) => {
                body += data;

                if(body.length > MAX_UPLOAD_SIZE) {
                    request.connection.destroy();
                    reject(new HttpError('Body exceeded maximum capacity', 413));
                }
            });

            request.on('end', () => {
                if(asBuffer) {
                    body = Buffer.from(body);

                } else {
                    try {
                        body = JSON.parse(body);
                    } catch(e) {
                        body = QueryString.parse(body);
                    }
                }

                resolve(body);
            });
        }); 
    }

    /**
     * Uploads a file
     *
     * @param {HTTP.IncomingMessage} request
     * @param {String} path
     */
    static async uploadFile(request, path) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);
        checkParam(path, 'path', String, true);

        let data = await this.getBody(request, true);

        await HashBrown.Service.FileService.write(data, path);
    }

    /**
     * Reads cookies from a request
     *
     * @param {HTTP.IncomingMessage} request
     * @param {String} key
     *
     * @return {String} Value
     */
    static getCookie(request, key) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);
        checkParam(key, 'key', String, true);

        for(let kvp of (request.headers.cookie || '').split(';')) {
            kvp = kvp.split('=');

            if(kvp[0] !== key) { continue; }

            return kvp[1];
        }

        return null;
    } 

    /**
     * Authenticates a request
     *
     * @param {HTTP.IncomingMessage} request
     * @param {Boolean} ignoreErrors
     *
     * @returns {HashBrown.Entity.Resource.User} User object
     */
    static async authenticate(request, ignoreErrors = false) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);
        checkParam(ignoreErrors, 'ignoreErrors', Boolean, true);

        let token = this.getCookie(request, 'token'); 

        // No token was provided
        if(!token && !ignoreErrors) {
            throw new HttpError('You need to be logged in to do that', 401);
        }
   
        let user = await HashBrown.Entity.User.getByToken(token);
        
        // No user was found
        if(!user && !ignoreErrors) {
            throw new HttpError('Your session has expired, please log in again', 401);
        }
            
        return user;
    }
    
    /**
     * Authorises a request
     *
     * @param {HTTP.IncomingMessage} request
     * @param {String} project
     * @param {String} scope
     * @param {Boolean} isAdmin
     */
    static async authorize(request, project = '', scope = '', isAdmin = false) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);
        checkParam(project, 'project', String);
        checkParam(scope, 'scope', String);
        checkParam(isAdmin, 'isAdmin', Boolean);

        let user = await this.authenticate(request);

        // Admin is required, and user isn't admin
        if(isAdmin && !user.isAdmin) {
            throw new HttpError('You need to be admin to do that', 403);
        }
        
        // A project is defined, and the user doesn't have it
        if(project && !user.hasScope(project)) {
            throw new HttpError('You do not have permission to use this project', 403);
        }

        // A scope is defined, and the user doesn't have it
        if(scope && !user.hasScope(project, scope)) {
            throw new HttpError(`You do not have permission to use the "${scope}" scope in this project`, 403);
        }

        return user;
    }
}

module.exports = ControllerBase;
