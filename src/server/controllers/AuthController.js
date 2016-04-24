'use strict';

// Classes
let Controller = require('./Controller');

/**
 * The authentication controller
 */
class AuthController extends Controller {
    /**
     * Initialises this controller
     *
     * @param {Object} app The express app object
     */
    static init(app) {
        // Login route
        app.post('/login', function(req, res) {
            
        });
    }
}

module.exports = AuthController;
