'use strict';

// Libs
let pathToRegexp = require('path-to-regexp');

// Classes
let Controller = require('./Controller');

/**
 * The main API controller
 */
class ApiController extends Controller {
    /**
     * Authenticates an API call
     *
     * @param {String} token
     * @param {String} scope
     */
    static authenticate(token, scope) {
        return new Promise((resolve, reject) => {
            UserHelper.findToken(token)
            .then((user) => {
                if(user) {
                    // If a scope is defined, check for it
                    if(scope) {
                        if(user.hasScope(ProjectHelper.currentProject, scope)) {
                            resolve(user);
                
                        } else {
                            reject(new Error('User with token "' + token + '" doesn\'t have scope "' + scope + '"'));

                        }
                   
                    // If no scope is required, return as normal 
                    } else {
                        resolve(user);

                    }

                } else {
                    reject(new Error('Found no user with token "' + token + '"'));
                }
            });
        });
    }

    /**
     * Sets project variables
     * 
     * @param {String} url
     */
    static setProjectVariables(url) {
        return new Promise((resolve, reject) => {
            let keys = [];
            let re = pathToRegexp('/api/:project/:environment/*', keys);
            let values = re.exec(url);
            let project;
            let environment;

            if(values) {
                // The first array item is the entire url, so remove it
                values.shift();

                for(let i in keys) {
                    let key = keys[i];

                    switch(key.name) {
                        case 'project':
                            project = values[i];
                            break;

                        case 'environment':
                            environment = values[i];
                            break;
                    }
                }
            }

            // We have both project and environment, we'll set them as current
            if(project && environment) {
                ProjectHelper.setCurrent(project, environment)
                .then(resolve)
                .catch(reject);
            
            // The parameters weren't provided, so just move on
            } else {
                resolve();

            }
        });
    }
        
    /**
     * Middleware
     *
     * @param {Object} settings
     */
    static middleware(settings) {
        settings = settings || {};

        return function middleware(req, res, next) {
            ApiController.authenticate(req.query.token, settings.scope)
            .then(() => {
                if(settings.setProject != false) {
                    ApiController.setProjectVariables(req.originalUrl)
                    .then(next)
                    .catch((e) => {
                        res.status(400).send(e);
                        debug.log(e, ApiController);
                    });
                } else {
                    next();
                }
            })
            .catch((e) => {
                res.status(403).send(e);   
                debug.log(e, ApiController);
            });    
        }
    }
}

module.exports = ApiController;
