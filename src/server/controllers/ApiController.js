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
            })
            .catch(reject);
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
            let re = pathToRegexp('/:root/:project/:environment/*', keys);
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
            if(settings.allowCORS == true) {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            
                debug.log('Allowing CORS for API call "' + req.originalUrl + '"', this);
            }

            if(settings.setProject != false) {
                ApiController.setProjectVariables(req.originalUrl)
                .then(() => {
                    if(settings.authenticate != false) {
                        ApiController.authenticate(req.query.token, settings.scope)
                        .then(() => {
                            next();
                        })
                        .catch((e) => {
                            res.status(403).send(e.message);   
                            debug.log(e.message, ApiController);
                        });    
                    
                    } else {
                        next();
                    }
                })
                .catch((e) => {
                    res.status(400).send(e.message);
                    debug.log(e.message, ApiController);
                });
            
            } else if(settings.authenticate != false) {
                ApiController.authenticate(req.query.token, settings.scope)
                .then(() => {
                    next();
                })
                .catch((e) => {
                    res.status(403).send(e.message);   
                    debug.log(e.message, ApiController);
                });    
            } else {
                next();
            
            }
        }
    }

    /**
     * Error reporting
     *
     * @param {Error} error
     *
     * @returns {String} Pretty print fo the error message
     */
     static error(error) {
        if(!error) {
            return 'Unspecified error';
        }

        return error.stack;
     }
}

module.exports = ApiController;
