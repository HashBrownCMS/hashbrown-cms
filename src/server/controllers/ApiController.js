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
            if(!token) {
                reject(new Error('No token was provided'));

            } else {
                UserHelper.findToken(token)
                .then((user) => {
                    if(user) {
                        // Set the currently authenticated user as a static variable
                        UserHelper.current = user;

                        // If a scope is defined, and the user isn't an admin, check for it
                        if(scope && !user.isAdmin) {
                            if(user.hasScope(ProjectHelper.currentProject, scope)) {
                                resolve(user);
                    
                            } else {
                                reject(new Error('User "' + user.username + '" with token "' + token + '" doesn\'t have scope "' + scope + '"'));

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
            }
        });
    }

    /**
     * Sets project variables
     * 
     * @param {String} url
     */
    static setProjectVariables(url) {
        let keys = [];
        let re = pathToRegexp('/:root/:project/:environment/*', keys);
        let values = re.exec(url);
        let project = null;
        let environment = null;

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

        // We have project (environment optional), we'll set them as current
        if(project) {
            return ProjectHelper.setCurrent(project, environment);
        
        // The parameters weren't provided, so just move on
        } else {
            return Promise.resolve();

        }
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

            // Allow CORS if specified
            if(settings.allowCORS == true) {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            
                debug.log('Allowing CORS for API call "' + req.originalUrl + '"', this);
            }

            // Using project parameter
            if(settings.setProject != false) {
                // Set the project variables
                ApiController.setProjectVariables(req.originalUrl)
                .then(() => {
                    // Using authentication
                    if(settings.authenticate != false) {
                        return ApiController.authenticate(token, settings.scope);
                    
                    // No authentication needed
                    } else {
                        return Promise.resolve();
                    }
                })
                .then(() => {
                    next();
                })
                .catch((e) => {
                    res.status(400).send(e.message);
                    debug.log(e.message, ApiController);
                });
            
            // Disregarding project parameter, but using authentication
            } else if(settings.authenticate != false) {
                ApiController.authenticate(req.cookies.token, settings.scope)
                .then(() => {
                    next();
                })
                .catch((e) => {
                    res.status(403).send(e.message);   
                    debug.log(e.message, ApiController);
                });    

            // Neither project parameter nor authentication needed
            } else {
                next();
            
            }
        }
    }

    /**
     * Prints a formatted error and logs it
     *
     * @param {Error} error
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
                fullErrorString += '\n\n' + error.stack;
            }

            if(!fullErrorString) {
                fullErrorString = error.toString();
            }

        } else if(typeof error !== 'object') {
            shortErrorString = error.toString();
            fullErrorString = shortErrorString;

        }

        if(printToLog) {
            debug.log(fullErrorString, this);
        }

        return shortErrorString;
     }
}

module.exports = ApiController;
