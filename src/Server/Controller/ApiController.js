'use strict';

/**
 * The main API controller
 *
 * @memberof HashBrown.Server.Controller
 */
class ApiController extends HashBrown.Controller.ControllerBase {
    /**
     * Check CORS
     *
     * @param {Object} settings
     * @param {Request} req
     * @param {Response} res
     */
    static checkCORS(settings, req, res) {
        let allowedOrigin = '';
        
        // If a string was specified, use it directly
        if(typeof settings.allowCORS === 'string') {
            allowedOrigin = settings.allowCORS;

        // A boolean value of true was specified, allow all origins
        } else if(settings.allowCORS == true) {
            allowedOrigin = '*';
            
        // If a function value was specified, run it
        } else if(typeof settings.allowCORS === 'function') {
            allowedOrigin = settings.allowCORS(req, res);
        
        }

        if(!allowedOrigin) { return; }

        res.header('Access-Control-Allow-Origin', allowedOrigin);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
        // Allowed origin did not match
        if(allowedOrigin !== '*' && allowedOrigin !== req.headers.origin) {
            throw new Error('Unauthorized');
        }
    }

    /**
     * Middleware
     *
     * @param {Object} settings
     */
    static middleware(settings) {
        settings = settings || {};

        return async (req, res, next) => {
            let token = req.cookies.token || req.query.token;

            // Make sure to clear double cookie values, if they occur
            if(!req.cookies.token) {
                res.clearCookie('token');
            }

            // Check CORS settings first
            ApiController.checkCORS(settings, req, res);
            
            // Using project parameter
            if(settings.setProject !== false) {
                // Set the project variables
                await ApiController.setProjectVariables(req);

                // Using authentication
                if(settings.authenticate !== false) {
                    req.user = await ApiController.authenticate(token, req.project, settings.scope, settings.needsAdmin);
                }
            
            // Disregarding project parameter, but using authentication
            } else if(settings.authenticate != false) {
                req.user = await ApiController.authenticate(token, null, settings.scope, settings.needsAdmin);

            }
            
            next();
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
