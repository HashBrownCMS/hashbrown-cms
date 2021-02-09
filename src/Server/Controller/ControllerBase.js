'use strict';

const HTTP = require('http');
const QueryString = require('querystring');
const Path = require('path');

const MAX_UPLOAD_SIZE = 20e6;

/**
 * The base class for all controllers
 *
 * @memberof HashBrown.Server.Controller
 */
class ControllerBase extends require('Common/Controller/ControllerBase') {
    /**
     * Gets a response based on a request
     *
     * @param {HashBrown.Http.Request} request
     *
     * @return {HashBrown.Http.Response} Response
     */
    static async getResponse(request) {
        checkParam(request, 'request', HashBrown.Http.Request, true);
       
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
            if(response && this.isCached(request, response)) {
                return new HashBrown.Http.Response('Not modified', 304);
            }

            return response;

        } catch(e) {
            let context = await this.getContext(request);
            let path = this.getUrl(request).pathname;
            let route = this.getRoute(path);

            return this.error(e, context, route.parameters);
        
        }
    }
    
    /**
     * Gets whether a response is cached client-side
     *
     * @param {HashBrown.Http.Request} request
     * @param {HashBrown.Http.Response} response
     *
     * @return {Boolean} Is cached
     */
    static isCached(request, response) {
        checkParam(request, 'request', HashBrown.Http.Request, true);
        checkParam(response, 'response', HashBrown.Http.Response, true);
        
        if(request.method !== 'GET') { return false; }
       
        return request.getETag() && response.getETag() && request.getETag() === response.getETag();
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

        if(this === HashBrown.Controller.ControllerBase) { return false; }

        let path = this.getUrl(request).pathname;

        return !!this.getRoute(path);
    }

    /**
     * Gets a WHATWG URL object from a request
     *
     * @param {HashBrown.Http.Request} request
     *
     * @return {URL} URL
     */
    static getUrl(request) {
        checkParam(request, 'request', HashBrown.Http.Request, true);

        // NOTE: We can assume protocol here, because we aren't actually using it
        return new URL(request.url, 'https://' + request.headers.host);
    }

    /**
     * Handles a request
     *
     * @param {HashBrown.Http.Request} request
     */
    static async handle(request) {
        checkParam(request, 'request', HashBrown.Http.Request, true);
        
        // Read request
        let requestBody = await this.getRequestBody(request);
        let requestQuery = this.getRequestQuery(request);

        let path = this.getUrl(request).pathname;
        let route = this.getRoute(path);
        let user = null;

        // Authenticated user
        if(route.user) {
            user = await this.authorize(request, route.parameters.project, route.user.scope, route.user.isAdmin);
        
        // Potentially anonymous user
        } else {
            user = await this.authenticate(request, true);

        }

        // Initialise context
        let context = await this.getContext(request, route.parameters, user);
        
        if(!route) {
            throw new HashBrown.Http.Exception('Not found', 404);
        }
        
        let methods = route.methods || [ 'GET' ];

        if(typeof route.redirect === 'string') {
            let url = Path.join(context.config.system.rootUrl, route.redirect);

            return new HashBrown.Http.Response(`You are being redirected to ${url}...`, 302, { 'Location': url });
        }

        if(methods.indexOf(request.method) < 0) {
            throw new HashBrown.Http.Exception(`Route ${route.pattern} does not support the method ${request.method}`, 405);
        }
       
        if(typeof route.handler !== 'function') {
            throw new HashBrown.Http.Exception(`Handler for route ${route.pattern} is not a function`, 500);
        }

        // Produce response
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
     * @param {HashBrown.Entity.Context} context
     *
     * @return {HashBrown.Http.Response} Response
     */
    static error(error, context) {
        checkParam(error, 'error', Error, true);
        
        debug.error(error, this);

        return new HashBrown.Http.Response(error.message || 'Unexpected error', error.code || 500, error.headers || {});
    }

    /**
     * Gets the context of a request
     *
     * @param {HashBrown.Http.Request} request
     * @param {HashBrown.Entity.User} user
     * @param {Object} parameters
     *
     * @return {HashBrown.Entity.Context} Context
     */
    static async getContext(request, parameters = {}, user = null) {
        checkParam(request, 'request', HashBrown.Http.Request, true);
        checkParam(parameters, 'parameters', Object, true);
        checkParam(user, 'user', HashBrown.Entity.User);
       
        let context = new HashBrown.Entity.Context();

        context.user = user;
        context.config = await HashBrown.Service.ConfigService.get();
       
        // Get locale information
        context.locales = await HashBrown.Service.LocaleService.getSystemLocales();

        if(user && user.locale !== 'en' && context.locales.indexOf(user.locale) > -1) {
            context.i18n = await HashBrown.Service.LocaleService.getSystemLocale(user.locale);
        }

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
     * @param {HashBrown.Http.Request} request
     *
     * @return {Object} Query
     */
    static getRequestQuery(request) {
        checkParam(request, 'request', HashBrown.Http.Request, true);
        
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
     * @param {HashBrown.Http.Request} request
     *
     * @return {Object|Buffer} Body
     */
    static async getRequestBody(request) {
        checkParam(request, 'request', HashBrown.Http.Request, true);

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
                    throw new HashBrown.Http.Exception(`Submitted content is not valid JSON: ${body}`, 406);
                }

            case 'application/x-www-form-urlencoded':
                return QueryString.parse(body);

        }

        throw new HashBrown.Http.Exception(`Content type ${contentType} is unsupported`, 415);
    }

    /**
     * Reads the token from a request
     *
     * @param {HashBrown.Http.Request} request
     *
     * @return {String} Value
     */
    static getToken(request) {
        checkParam(request, 'request', HashBrown.Http.Request, true);

        let requestSearchParams = this.getUrl(request).searchParams;

        if(requestSearchParams && requestSearchParams.get('token')) {
            return requestSearchParams.get('token');
        }

        for(let kvp of (request.headers.cookie || '').split(';')) {
            kvp = kvp.split('=');

            let key = (kvp[0] || '').trim();
            let value = (kvp[1] || '').trim();

            if(key !== 'token') { continue; }

            return value;
        }

        return null;
    } 

    /**
     * Authenticates a request
     *
     * @param {HashBrown.Http.Request} request
     * @param {Boolean} ignoreErrors
     *
     * @returns {HashBrown.Entity.User} User object
     */
    static async authenticate(request, ignoreErrors = false) {
        checkParam(request, 'request', HashBrown.Http.Request, true);
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
     * @param {HashBrown.Http.Request} request
     * @param {String} project
     * @param {String} scope
     * @param {Boolean} isAdmin
     */
    static async authorize(request, project = '', scope = '', isAdmin = false) {
        checkParam(request, 'request', HashBrown.Http.Request, true);
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
