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
        let paramPattern = /\${([^}]+)}/g;
        
        for(let routePattern in this.routes) {
            let route = this.routes[routePattern];
            route.pattern = routePattern;
            route.regex = route.pattern.indexOf('${') < 0 ? null : new RegExp(route.pattern.replace(paramPattern, '([^\/]+)'));

            if(
                route.pattern === requestPath ||
                (route.regex && route.regex.test(requestPath))
            ) {
                return route;
            }
        }

        return null;
    }

    /**
     * Handles a request
     *
     * @param {HTTP.IncomingMessage} request
     * @param {HTTP.ServerResponse} response
     */
    static async handle(request, response) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);
        checkParam(response, 'response', HTTP.ServerResponse, true);
       
        let requestPath = Url.parse(request.url, true).path;
        
        try {
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

            let paramPattern = new RegExp('${([^}]+)}', 'g');
            
            // Build request parameters
            let requestParams = {};

            if(route.regex) {
                let routeParamNames = (route.pattern.match(paramPattern) || []).map(p => p.replace(/[\${}]/g, ''));
                let requestParamValues = (request.url.match(route.regex) || []);

                for(let i in routeParamNames) {
                    requestParams[routeParamNames[i]] = requestParamValues[i];
                }
            }

            // Authorise user
            let user = null;

            if(route.user && (route.user === true || typeof route.user === 'object')) {
                user = await this.authorize(request, requestParams.project, route.user.scope, route.user.isAdmin);
            }

            // Validate project
            if(requestParams.project) {
                let projectExists = await HashBrown.Service.ProjectService.projectExists(requestParams.project);

                if(!projectExists) {
                    return new HttpResponse(`Project "{requestParams.project}" could not be found`, 404);
                }

                // Validate environment
                if(requestParams.environment) {
                    let environmentExists = await HashBrown.Service.ProjectService.environmentExists(requestParams.project, requestParams.environment);

                    if(!environmentExists) {
                        return new HttpResponse(`Environment "${requestParams.environment}" was not found for project "${requestParams.project}"`, 404);
                    }
                }
            }

            // Read request body
            let requestBody = await this.getBody(request);

            let responseSuccess = await route.handler.call(this, request, requestParams, requestBody, user);

            if(responseSuccess instanceof HttpResponse === false) {
                return new HttpResponse('Response was not of type HttpResponse', 500);
            }

            return responseSuccess;

        } catch(error) {
            if(error instanceof HttpError === false) {
                error = new HttpError(error.message, 500, error.stack);
            }

            return this.error(error);

        }
    }

    /**
     * Handles an error
     *
     * @param {HttpError} error
     */
    static error(error) {
        checkParam(error, 'error', HttpError, true);
       
        return new HttpResponse(error.stack || error.message, error.code, { 'Content-Type': 'text/plain' });
    }

    /**
     * Gets the body of a request
     *
     * @param {HTTP.IncomingMessage} request
     *
     * @return {Object} Body
     */
    static getBody(request) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);

        return new Promise((resolve, reject) => {
            switch(request.method) {
                case 'POST': case 'PUT':
                    let body = '';

                    request.on('data', (data) => {
                        body += data;

                        if(body.length > MAX_UPLOAD_SIZE) {
                            request.connection.destroy();
                            reject(new HttpError('Body exceeded maximum capacity', 413));
                        }
                    });

                    request.on('end', () => {
                        resolve(QueryString.parse(body));
                    });
                    break;

                case 'GET':
                    resolve(Url.parse(request.url, true).query);
                    break;
            }
        }); 
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

        for(let kvp of request.headers.cookie.split(';')) {
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
     *
     * @returns {HashBrown.Entity.Resource.User} User object
     */
    static async authenticate(request) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);
        
        let token = this.getCookie(request, 'token'); 

        // No token was provided
        if(!token) {
            throw new HttpError('You need to be logged in to do that', 401);
        }
    
        let user = await HashBrown.Service.UserService.findToken(token);
        
        // No user was found
        if(!user) {
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
    }
}

module.exports = ControllerBase;
