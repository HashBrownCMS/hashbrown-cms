'use strict';

const PathToRegexp = require('path-to-regexp');

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
        for(let method of this.getAllMethods()) {
            let path = '/api/:project/:environment/' + this.getPrefix() + '/' + method.name.replace(/post|get/,'').toLowerCase();
            let isGet = method.name.substring(0, 3).toLowerCase() === 'get';
            let isPost = method.name.substring(0, 4).toLowerCase() === 'post';

            if(isGet) {
                app.get(path, method);
            } else if(isPost) {
                app.post(path, method);
            }
        }
    }

    /**
     * Gets a list of all methods
     *
     * @returns {Array} methods
     */
    static getAllMethods() {
        let methods = [];

        for(let name of Object.getOwnPropertyNames(this)) {
            if(typeof this[name] === 'function') {
                methods[methods.length] = this[name];
            }
        }

        return methods;
    }

    /**
     * Gets the prefix for this controller
     *
     * @return {String} prefix
     */
    static getPrefix() {
        let name = this.name.replace('Controller', '').toLowerCase();
        let prefix = name;

        return prefix;
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
