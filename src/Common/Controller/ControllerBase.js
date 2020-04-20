'use strict';

/**
 * The base class for all controllers
 *
 * @memberof HashBrown.Common.Controller
 */
class ControllerBase {
    /**
     * Gets the alias of the library this entity belongs to
     *
     * @return {String} Alias
     */
    static get library() {
        let alias = HashBrown.Service.LibraryService.getAlias(this);

        if(!alias) {
            throw new Error(`The controller ${this.name} does not belong to any library`);
        }

        return alias;
    }
    
    /**
     * Gets a list of routes
     *
     * @return {Object} Routes
     */
    static get routes() {
        return {};
    }
    
    /**
     * Checks whether this controller can handle a request
     *
     * @param {HashBrown.Http.Request|Event} request
     *
     * @return {Boolean} Can handle request
     */
    static canHandle(request) {
        return false;
    }
    
    /**
     * Handles an error
     *
     * @param {Error} error
     *
     * @return {HashBrown.Entity.View.ViewBase|HashBrown.Http.Response} Response
     */
    static error(error) {
        throw error;
    }
    
    /**
     * Gets a route definition from a path
     *
     * @param {String} path
     *
     * @return {Object} Route definition
     */
    static getRoute(path) {
        checkParam(path, 'path', String);

        let requestParts = path.match(/[^\/]+/g) || [];
       
        let route = null;
        let routes = this.routes;

        for(let pattern in routes) {
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
}

module.exports = ControllerBase;
