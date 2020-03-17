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
     * Gets the last modified time from a request
     *
     * @param {HTTP.IncomingMessage} request
     *
     * @return {Date} Time
     */
    static async getLastModified(request) {
        checkParam(request, 'request', HTTP.IncomingMessage, true);
        
        if(!this.lastModified) { 
            this.lastModified = {};
        }
        
        let key = this.getUrl(request).pathname;

        // Mutation: Reset last modifed dates on any other request methods than GET
        if(request.method !== 'GET') {
            this.resetLastModified(key);
        }

        // Mutation: Set a new last modified date if needed
        if(!this.lastModified[key]) {
            this.lastModified[key] = new Date();
        }

        return this.lastModified[key];
    }

    /**
     * Resets last modified dates related to a key
     *
     * @param {String} key
     */
    static resetLastModified(key) {
        checkParam(key, 'key', String);
        
        if(!key || !this.lastModified) { return; }

        for(let k in this.lastModified) {
            if(k.indexOf(key) < 0 && key.indexOf(k) < 0) {
                continue;
            }

            delete this.lastModified[k];
        }
    }

    /**
     * Gets a response based on a request
     *
     * @param {HTTP.IncomingMessage} request
     *
     * @return {HttpResponse} Response
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
   
        // Get cache info
        let requestMTime = request.headers['If-Modified-Since'] || request.headers['if-modified-since'];
        let responseMTime = await this.getLastModified(request);
        let requestETag = request.headers['If-None-Match'] || request.headers['if-none-match'];
        let responseETag = '"' + (this.getUrl(request).pathname.match(/[^\/]+/g) || []).join('-') + '--' + responseMTime.getTime() + '"';

        let mTimeMatch = requestMTime && responseMTime && new Date(requestMTime) >= new Date(responseMTime);
        let eTagMatch = requestETag && responseETag && requestETag === responseETag;

        // ETag was matched, return 304
        if(request.method === 'GET' && (eTagMatch || mTimeMatch)) {
            return new HttpResponse('Not modified', 304);
        }

        // Generate response
        try {
            let response = await this.handle(request);

            // Include ETag and cache response, if allowed to store
            if(request.method === 'GET' && response.headers['Cache-Control'] !== 'no-store') {
                response.headers['ETag'] = responseETag;
            }

            response.headers['Last-Modified'] = responseMTime.toString();

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

            let regexMatches = 0;
            let exactMatches = 0;

            for(let i in requestParts) {
                let requestPart = requestParts[i];
                let patternPart = patternParts[i];

                if(requestPart === patternPart) {
                    exactMatches++;
                }

                if(patternPart.match(/\${[^}]+}/)) {
                    regexMatches++;
                }
            }

            let matches = regexMatches + exactMatches;

            if(matches !== patternParts.length) { continue; }

            route = routes[pattern];
            route.pattern = pattern;

            break;
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
       
        let requestPath = this.getUrl(request).pathname;
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

        // Get request parameters
        let requestParameters = this.getRequestParameters(requestPath, route.pattern);

        // Authorise/authenticate user
        let user = null;

        // ^ Authenticated user
        if(route.user === true) {
            user = await this.authorize(request, requestParameters.project);
        
        // ^ Permissions specified
        } else if(typeof route.user === 'object') {
            user = await this.authorize(request, requestParameters.project, route.user.scope, route.user.isAdmin);
        
        // ^ Anonymous
        } else {
            user = await this.authenticate(request, true);

        }

        // Validate project
        if(requestParameters.project) {
            let project = await HashBrown.Entity.Project.get(requestParameters.project);

            if(!project) {
                return new HttpResponse(`Project "${requestParameters.project}" could not be found`, 404);
            }

            // Validate environment
            if(requestParameters.environment) {
                let environmentExists = await project.hasEnvironment(requestParameters.environment);

                if(!environmentExists) {
                    return new HttpResponse(`Environment "${requestParameters.environment}" was not found for project "${requestParameters.project}"`, 404);
                }
            }
        }

        // Read request and produce response
        try {
            let requestBody = await this.getRequestBody(request);
            let requestQuery = this.getRequestQuery(request);
            let response = await route.handler.call(this, request, requestParameters, requestBody, requestQuery, user);

            if(response instanceof HttpResponse === false) {
                throw new HttpError('Response was not of type HttpResponse', 500);
            }

            return response;

        } catch(e) {
            return new HttpResponse(e.message, e.code || 500); 

        }
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
                    reject(new HttpError('Body exceeded maximum capacity', 413));
                }
            });

            request.on('end', () => {
                resolve();
            });
        });

        if(!body) { return {}; }

        let contentTypeHeaderParts = (request.headers['Content-Type'] || request.headers['content-type'] || '').split(';').map((x) => x.trim());
        let contentTypeName = contentTypeHeaderParts.shift();
        let contentTypeSettings = QueryString.parse(contentTypeHeaderParts.join('&'));

        switch(contentTypeName) {
            case 'multipart/form-data':
                if(!contentTypeSettings.boundary) {
                    throw new HttpError('Boundary parameter is required for multipart/form-data');
                }

                let files = [];

                console.log('BOUNDARY  ', contentTypeSettings.boundary);

                for(let line of body.split('\n')) {
                    line = (line || '').trim();

                    if(!line) { continue; }

                    // End of the body data
                    if(line === '--' + contentTypeSettings.boundary + '--') {
                        break;
                    }

                    // Start of a new file
                    if(line === '--' + contentTypeSettings.boundary) {
                        files.push({
                            filename: '',
                            type: '',
                            data: Buffer.from('')
                        });
                        continue;
                    }

                    let file = files[files.length - 1];

                    if(!file) { continue; }

                    if(line.indexOf('Content-Disposition') > -1) {
                        file.filename = (line.match(/filename="([^"]+)"/) || [])[1];
                    } else if(line.indexOf('Content-Type') > -1) {
                        file.type = line.replace('Content-Type: ', '').trim();
                    } else {
                        file.data = Buffer.concat([file.data, Buffer.from(line)]);
                    }
                }

                return {
                    files: files
                };

            case 'application/json':
                try {
                    return JSON.parse(body);
                } catch(e) {
                    return {};
                }

            case 'text/plain':
                return QueryString.parse(body);
        }

        return {};
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

        for(let kvp of (request.headers.cookie || '').split(';')) {
            kvp = kvp.split('=');

            if(kvp[0] !== 'token') { continue; }

            return kvp[1];
        }

        let requestSearchParams = this.getUrl(request).searchParams;

        if(requestSearchParams) {
            return requestSearchParams.get('token');
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
            throw new HttpError('Please log in to continue', 401);
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
