'use strict';

/**
 * The base class for all controllers
 *
 * @memberof HashBrown.Server.Controller
 */
class ControllerBase {
    /**
     * Initialises this controller
     */
    static init(app) {
        throw new Error('The "init" method must be overridden');
    }

    /**
     * Authenticates a request
     *
     * @param {String} token
     * @param {String} project
     * @param {String} scope
     * @param {Boolean} needsAdmin
     *
     * @returns {Promise} User object
     */
    static async authenticate(token, project, scope, needsAdmin) {
        // No token was provided
        if(!token) {
            throw new Error('You need to be logged in to do that');
        }
    
        let user = await HashBrown.Service.UserService.findToken(token);
        
        // No user was found
        if(!user) {
            throw new Error('You need to be logged in to do that');
        }
            
        // Admin is required, and user isn't admin
        if(needsAdmin && !user.isAdmin) {
            throw new Error('You need to be admin to do that');
        }

        // A scope is defined, and the user doesn't have it
        if(project && scope && !user.hasScope(project, scope)) {
            throw new Error('You need the "' + scope + '" scope to do that');
        }
           
        return user;
    }

    /**
     * Sets project variables
     * 
     * @param {Object} req
     */
    static async setProjectVariables(req) {
        let values = req.originalUrl.split('/');
        let project = null;
        let environment = null;

        if(values) {
            if(!values[0]) { values.shift(); }
            if(values[0] === 'api') { values.shift(); }
            if(values[0] === 'media') { values.shift(); }

            req.project = values[0];
            req.environment = values[1];
        }
        
        // Check if project and environment exist
        let projectExists = await HashBrown.Service.ProjectService.projectExists(req.project);
        
        if(!projectExists) {
            throw new Error('Project "' + req.project + '" could not be found');
        }

        if(req.environment) {
            let environmentExists = await HashBrown.Service.ProjectService.environmentExists(req.project, req.environment);

            if(!environmentExists) {
                throw new Error('Environment "' + req.environment + '" was not found for project "' + req.project + '"');
            }
        }
    }
}

module.exports = ControllerBase;
