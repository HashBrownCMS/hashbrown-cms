'use strict';

/**
 * The main API controller
 *
 * @memberof HashBrown.Server.Controllers
 */
class ApiController extends HashBrown.Controllers.Controller {
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
                    return ApiController.authenticate(token, null, settings.scope, settings.needsAdmin);

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
            debug.log(fullErrorString, this);
        }

        return shortErrorString;
     }
}

module.exports = ApiController;
