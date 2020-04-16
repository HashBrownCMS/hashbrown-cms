'use strict';

const HTTP = require('http');
const QueryString = require('querystring');

const MAX_UPLOAD_SIZE = 20e6;

/**
 * The base class for all controllers
 *
 * @memberof HashBrown.Server.Controller
 */
class ControllerBase {
    /**
     * Gets a response based on a request
     *
     * @param {HTTP.IncomingMessage} request
     *
     * @return {HashBrown.Http.Response} Response
     */
    static async getResponse(request) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);
       
        // Ignore paths with suspicious components
        if(
            request.url.indexOf('..') > -1 ||
            request.url.indexOf('*') > -1 ||
            request.url.indexOf('\\') > -1
        ) {
            return null;
        }
               
        // Check if this controller can handle the request
        if(!this.canHandle(request)) { return null; }
   
        // Generate response
        try {
            let response = await this.handle(request);

            // Check for cache matches
            if(request.method === 'GET' && response.headers['Cache-Control'] !== 'no-store') {
                let requestMTime = request.headers['If-Modified-Since'] || request.headers['if-modified-since'];
                let requestETag = request.headers['If-None-Match'] || request.headers['if-none-match'];
                let responseMTime = response.headers['Last-Modified'];
                let responseETag = response.headers['ETag'];

                // Compare modified date and ETag, set response code to 304 if needed
                let mTimeMatch = requestMTime && responseMTime && new Date(requestMTime) >= new Date(responseMTime);
                let eTagMatch = requestETag && responseETag && requestETag === responseETag;
                
                if(mTimeMatch || eTagMatch) {
                    response.code = 304;
                }
            }

            return response;

        } catch(e) {
            return this.error(e);
        
        }
    }

    /**
     * Checks whether this controller can handle a request
     *
     * @param {HTTP.IncomingMessage} request
     *
     * @return {Boolean} Can handle request
     */
    static canHandle(request) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);

        if(this === HashBrown.Controller.ControllerBase) { return false; }

        return !!this.getRoute(request);
    }

    /**
     * Gets a WHATWG URL object from a request
     *
     * @param {HTTP.IncomingMessage} request
     *
     * @return {URL} URL
     */
    static getUrl(request) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);

        // NOTE: We can assume protocol here, because we aren't actually using it
        return new URL(request.url, 'https://' + request.headers.host);
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

        let requestPath = this.getUrl(request).pathname;
        let requestParts = requestPath.match(/[^\/]+/g) || [];
       
        let route = null;
        let routes = this.routes;

        for(let pattern in routes) {
            let methods = routes[pattern].methods || [ 'GET' ];

            if(methods.indexOf(request.method) < 0) { continue; }

            let patternParts = pattern.match(/[^\/]+/g) || [];

            if(patternParts.length !== requestParts.length) { continue; }

            let matches = 0;
            let parameters = {};

            for(let i in requestParts) {
                let requestPart = requestParts[i] || '';
                let patternPart = patternParts[i] || '';

                let exactMatch = requestPart === patternPart;
                let parameterMatch = patternPart.match(/\${([^}]+)}/)
                
                if(exactMatch || parameterMatch) {
                    matches++;
                }
               
                if(parameterMatch) {
                    parameters[parameterMatch[1]] = requestPart;
                }
            }

            if(matches !== patternParts.length) { continue; }

            route = routes[pattern];
            route.pattern = pattern;
            route.parameters = parameters;

            break;
        }

        return route;
    }

    /**
     * Handles a request
     *
     * @param {HTTP.IncomingMessage} request
     */
    static async handle(request) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);

        let route = this.getRoute(request);
        
        if(!route) {
            throw new HashBrown.Http.Exception('Not found', 404);
        }
       
        if(typeof route.redirect === 'string') {
            return new HashBrown.Http.Response(`You are being redirected to ${route.redirect}...`, 302, { 'Location': route.redirect });
        }

        if(typeof route.handler !== 'function') {
            throw new HashBrown.Http.Exception(`Handler for route ${route.pattern} is not a function`, 500);
        }

        let user = null;

        // Authenticated user
        if(route.user) {
            user = await this.authorize(request, route.parameters.project, route.user.scope, route.user.isAdmin);
        
        // Potentially anonymous user
        } else {
            user = await this.authenticate(request, true);

        }

        // Read request and produce response
        let context = await this.getContext(request, route.parameters, user);
        let requestBody = await this.getRequestBody(request);
        let requestQuery = this.getRequestQuery(request);
        let response = await route.handler.call(this, request, route.parameters, requestBody, requestQuery, context);

        if(response instanceof HashBrown.Http.Response === false) {
            throw new HashBrown.Http.Exception('Response was not of type HashBrown.Http.Response', 500);
        }

        return response;
    }

    /**
     * Handles an error
     *
     * @param {Error} error
     *
     * @return {HashBrown.Http.Response} Response
     */
    static error(error) {
        checkParam(error, 'error', Error, true);
        
        debug.error(error, this, true);

        return new HashBrown.Http.Response(error.message || 'Unexpected error', error.code || 500, error.headers || {});
    }

    /**
     * Gets the context of a request
     *
     * @param {HTTP.IncomingMessage} request
     * @param {HashBrown.Entity.User} user
     * @param {Object} parameters
     *
     * @return {HashBrown.Entity.Context} Context
     */
    static async getContext(request, parameters, user) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);
        checkParam(parameters, 'parameters', Object, true);
        checkParam(user, 'user', HashBrown.Entity.User);
       
        let context = new HashBrown.Entity.Context();

        context.user = user;

        // Validate project
        if(parameters.project) {
            context.project = await HashBrown.Entity.Project.get(parameters.project);

            if(!context.project) {
                throw new HashBrown.Http.Exception(`Project "${parameters.project}" could not be found`, 404);
            }

            // Validate environment
            if(parameters.environment) {
                let environmentExists = await context.project.hasEnvironment(parameters.environment);

                if(!environmentExists) {
                    throw new HashBrown.Http.Exception(`Environment "${parameters.environment}" was not found for project "${requestParameters.project}"`, 404);
                }

                context.environment = parameters.environment;
            }
        }

        return context;
    }

    /**
     * Gets the query of a request
     *
     * @param {HTTP.IncomingMessage} request
     *
     * @return {Object} Query
     */
    static getRequestQuery(request) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);
        
        let requestSearchParams = this.getUrl(request).searchParams;
        let requestQuery = {};

        if(requestSearchParams) {
            requestSearchParams.forEach((value, key) => {
                requestQuery[key] = value;
            });
        }

        // Exlude "token" from the query, as it's only used for authentication
        delete requestQuery.token;

        return requestQuery;
    }

    /**
     * Gets the body of a request
     *
     * @param {HTTP.IncomingMessage} request
     *
     * @return {Object|Buffer} Body
     */
    static async getRequestBody(request) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);

        let body = '';

        await new Promise((resolve, reject) => {
            request.on('data', (data) => {
                body += data;

                if(body.length > MAX_UPLOAD_SIZE) {
                    request.connection.destroy();
                    reject(new HashBrown.Http.Exception('Body exceeded maximum capacity', 413));
                }
            });

            request.on('end', () => {
                resolve();
            });
        });

        if(!body) { return {}; }

        let contentType = (request.headers['Content-Type'] || request.headers['content-type'] || '').split(';').shift().trim();

        switch(contentType) {
            case 'application/json':
                try {
                    return JSON.parse(body);
                } catch(e) {
                    return {};
                }

            case 'application/x-www-form-urlencoded':
                return QueryString.parse(body);

        }

        throw new HashBrown.Http.Exception(`Content type ${contentType} is unsupported`, 415);
    }

    /**
     * Reads the token from a request
     *
     * @param {HTTP.IncomingMessage} request
     *
     * @return {String} Value
     */
    static getToken(request) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);

        let requestSearchParams = this.getUrl(request).searchParams;

        if(requestSearchParams && requestSearchParams.get('token')) {
            return requestSearchParams.get('token');
        }

        for(let kvp of (request.headers.cookie || '').split(';')) {
            kvp = kvp.split('=');

            if(kvp[0] !== 'token') { continue; }

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
     * @returns {HashBrown.Entity.User} User object
     */
    static async authenticate(request, ignoreErrors = false) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);
        checkParam(ignoreErrors, 'ignoreErrors', Boolean, true);

        let token = this.getToken(request); 

        // No token was provided
        if(!token && !ignoreErrors) {
            throw new HashBrown.Http.Exception('Please log in to continue', 401);
        }
   
        let user = await HashBrown.Entity.User.getByToken(token, { withPassword: true, withTokens: true });
        
        // No user was found
        if(!user && !ignoreErrors) {
            throw new HashBrown.Http.Exception('Your session has expired, please log in again', 401);
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
            throw new HashBrown.Http.Exception('You need to be admin to do that', 403);
        }
        
        // A project is defined, and the user doesn't have it
        if(project && !user.hasScope(project)) {
            throw new HashBrown.Http.Exception('You do not have permission to use this project', 403);
        }

        // A scope is defined, and the user doesn't have it
        if(scope && !user.hasScope(project, scope)) {
            throw new HashBrown.Http.Exception(`You do not have permission to use the "${scope}" scope in this project`, 403);
        }

        return user;
    }
}

module.exports = ControllerBase;
