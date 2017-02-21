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
     * @param {String} project
     * @param {String} scope
     * @param {Boolean} needsAdmin
     *
     * @returns {Promise} User object
     */
    static authenticate(token, project, scope, needsAdmin) {
        if(!token) {
            return Promise.reject(new Error('No token was provided'));
        }
    
        return UserHelper.findToken(token)
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
        let keys = [];
        let re = pathToRegexp('/:root/:project/:environment/*', keys);
        let values = re.exec(req.originalUrl);
        let project = null;
        let environment = null;

        if(values) {
            // The first array item is the entire url, so remove it
            values.shift();

            for(let i in keys) {
                let key = keys[i];

                switch(key.name) {
                    case 'project':
                        req.project = values[i];
                        break;

                    case 'environment':
                        req.environment = values[i];
                        break;
                }
            }
        }
        
        // Environment sanity check
        if(req.environment == 'settings') {
            req.environment = null;
        }

        // Check if project and environment exist
        return ProjectHelper.projectExists(req.project)
        .then((projectExists) => {
            if(!projectExists) {
                return Promise.reject('Project "' + req.project + '" could not be found');
            }

            if(req.environment) {
                return ProjectHelper.environmentExists(req.project, req.environment)
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
        
    /**
     * Check CORS
     *
     * @param {Object} settings
     * @param {Request} req
     * @param {Response} res
     *
     * @returns {Promise} Result
     */
    static checkCORS(settings, req, res) {
        function getPromise() {
            // If a string was specified, use it directly
            if(typeof settings.allowCORS === 'string') {
                return Promise.resolve(settings.allowCORS);
            }

            // a boolean value of true was specified, allow all origins
            if(settings.allowCORS == true) {
                return Promise.resolve('*');
            }
            
            // If a function value was specified, run it
            if(typeof settings.allowCORS === 'function') {
                return Promise.resolve(settings.allowCORS(req, res));
            
            }

            // Nothing was specified, move on
            return Promise.resolve();
        };

        return getPromise()
        .then((allowedOrigin) => {
            if(allowedOrigin) {
                res.header('Access-Control-Allow-Origin', allowedOrigin);
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            
                // Allowed origin did not match
                if(allowedOrigin != '*' && allowedOrigin != req.headers.origin) {
                    return Promise.reject(new Error('Unauthorized'));
                }
            }
           
            return Promise.resolve();
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
            let token = req.cookies.token || req.query.token;

            // Make sure to clear double cookie values, if they occur
            if(!req.cookies.token) {
                res.clearCookie('token');
            }

            // Check CORS settings first
            ApiController.checkCORS(settings, req, res)
            .then(() => {
                // Using project parameter
                if(settings.setProject != false) {
                    // Set the project variables
                    return ApiController.setProjectVariables(req)
                    .then(() => {
                        // Using authentication
                        if(settings.authenticate != false) {
                            return ApiController.authenticate(token, req.project, settings.scope, settings.needsAdmin);
                        
                        // No authentication needed
                        } else {
                            return Promise.resolve();
                        }
                    });
                
                // Disregarding project parameter, but using authentication
                } else if(settings.authenticate != false) {
                    return ApiController.authenticate(req.cookies.token, null, settings.scope, settings.needsAdmin);

                // Neither project parameter nor authentication needed
                } else {
                    return Promise.resolve();
                
                }
            })
            .then((user) => {
                req.user = user;

                next();
            })
            .catch((e) => {
                res.status(400).send(ApiController.printError(e));
            });
        }
    }

    /**
     * Prints a formatted error and logs it
     *
     * @param {Error} error
     * @param {Boolean} printToLog
     *
     * @returns {String} Pretty print for the error message
     */
     static printError(error, printToLog = true) {
        if(!error) {
            return 'Unspecified error';
        }

        let fullErrorString = '';
        let shortErrorString = '';

        if(error instanceof Error) {
            shortErrorString = error.message || '';
            fullErrorString = shortErrorString;
           
            if(error.stack) {
                fullErrorString = error.stack;
            }

            if(!fullErrorString) {
                fullErrorString = error.toString();
            }

        } else if(typeof error !== 'object') {
            shortErrorString = error.toString();
            fullErrorString = shortErrorString;

        }

        if(printToLog) {
            debug.log('ERROR: ' + fullErrorString, this);
        }

        return shortErrorString;
     }
}

module.exports = ApiController;
