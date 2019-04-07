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
    static authenticate(token, project, scope, needsAdmin) {
        if(!token) {
            return Promise.reject(new Error('You need to be logged in to do that'));
        }
    
        return HashBrown.Helpers.UserHelper.findToken(token)
        .then((user) => {
            // If no user was found, return error
            if(!user) {
                return Promise.reject(new Error('Found no user with token "' + token + '"'));
            }
            
            // If admin is required, and user isn't admin, return error
            if(needsAdmin && !user.isAdmin) {
                return Promise.reject(new Error('User "' + user.username + '" is not an admin'))
            }

            // If a scope is defined, and the user deosn't have it, return error
            if(project && scope && !user.hasScope(project, scope)) {
                return Promise.reject(new Error('User "' + user.username + '" does not have scope "' + scope + '"'));
            }
           
            // If all requirements have been met, resolve
            return Promise.resolve(user);
        });
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
