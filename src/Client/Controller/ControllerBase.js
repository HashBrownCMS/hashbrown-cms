'use strict';

/**
 * The base class for all controllers
 *
 * @memberof HashBrown.Client.Controller
 */
class ControllerBase extends require('Common/Controller/ControllerBase') {
    /**
     * Checks whether this controller can handle a request
     *
     * @param {Event} request
     *
     * @return {Boolean} Can handle request
     */
    static canHandle(request) {
        checkParam(request, 'request', Event, true);

        if(this === HashBrown.Controller.ControllerBase) { return false; }
        if(request instanceof HashChangeEvent === false) { return false; }

        let path = location.hash.substring(1);

        return !!this.getRoute(path);
    }
    
    /**
     * Gets the current WHATWG URL object
     *
     * @return {URL} URL
     */
    static getUrl() {
        return new URL(location.href);
    }
    
    /**
     * Handles an error
     *
     * @param {Error} error
     *
     * @return {HashBrown.Entity.View.ViewBase} Response
     */
    static error(error) {
        checkParam(error, 'error', Error, true);
        
        debug.error(error, this, true);

        return UI.error(error);
    }
    
    /**
     * Gets a response based on a request
     *
     * @param {HashChangeEvent} request
     *
     * @return {HashBrown.Entity.View.ViewBase} Response
     */
    static async getResponse(request) {
        checkParam(request, 'request', HashChangeEvent, true);
       
        // Check if this controller can handle the request
        if(!this.canHandle(request)) { return null; }
                
        // Generate response
        let response = null;
        
        try {
            response = await this.handle(request);

        } catch(e) {
            return this.error(e);
        
        }
       
        return response;
    }

    /**
     * Handles any request
     *
     * @param {Event} request
     *
     * @return {HashBrown.Entity.View.ViewBase} Response
     */
    static async handle(request) {
        checkParam(request, 'request', Event, true);

        let path = location.hash.substring(1);
        let route = this.getRoute(path);

        if(!route) {
            throw new Error('View not found');
        }
        
        if(typeof route.redirect === 'string') {
            return location.hash = route.redirect;
        }
        
        if(typeof route.handler !== 'function') {
            throw new Error(`Handler for route ${route.pattern} is not a function`);
        }
        
        // Read request and produce response       
        return await route.handler.call(this, request, route.parameters);
    }
}

module.exports = ControllerBase;
