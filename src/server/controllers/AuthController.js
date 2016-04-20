'use strict';

let passport = require('passport');

// Strategies
let LocalStrategy = require('passport-local').Strategy;

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
        // Strategy setup
        passport.use(new LocalStrategy(
            function(username, password, done) {
                User.findOne({ usename: username }, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    
                    if (!user) {
                        return done(null, false, { message: 'Incorrect username.' });
                    }
                    
                    if (!user.validPassword(password)) {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                    
                    return done(null, user);
                });
            }
        ));

        // Express setup
        app.use(passport.initialize());
        app.use(passport.session());

        // API route
        app.post('/login', passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));
    }
}

module.exports = AuthController;
