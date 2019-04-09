'use strict';

/**
 * The base class for all controllers
 *
 * @memberof HashBrown.Server.Controllers
 */
class Controller {
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
    
        let user = await HashBrown.Helpers.UserHelper.findToken(token);
        
        // No user was found
        if(!user) {
            throw new Error('Found no user with token "' + token + '"');
        }
            
        // Admin is required, and user isn't admin
        if(needsAdmin && !user.isAdmin) {
            throw new Error('User "' + user.username + '" is not an admin');
        }

        // A scope is defined, and the user deosn't have it
        if(project && scope && !user.hasScope(project, scope)) {
            throw new Error('User "' + user.username + '" does not have scope "' + scope + '"');
        }
           
        return user;
    }

    /**
     * Sets project variables
     * 
     * @param {Object} req
     */
    static setProjectVariables(req) {
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
        
        // Environment sanity check
        if(req.environment == 'settings') {
            req.environment = null;
        }

        // Check if project and environment exist
        return HashBrown.Helpers.ProjectHelper.projectExists(req.project)
        .then((projectExists) => {
            if(!projectExists) {
                return Promise.reject('Project "' + req.project + '" could not be found');
            }

            if(req.environment) {
                return HashBrown.Helpers.ProjectHelper.environmentExists(req.project, req.environment)
                .then((environmentExists) => {
                    if(!environmentExists) {
                        return Promise.reject(new Error('Environment "' + req.environment + '" was not found for project "' + req.project + '"'));
                    }

                    return Promise.resolve();
                });

            } else {
                return Promise.resolve();

            }
        });
    }
        
}

module.exports = Controller;
