'use strict';

let ApiController = require('./ApiController');

class UserController extends ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.post('/api/user/login', this.login);
        app.get('/api/user/scopes', this.getScopes);
        app.get('/api/users', this.middleware({scope: 'users', setProject: false}), this.getUsers);
        app.post('/api/user/new', this.middleware({scope: 'users', setProject: false}), this.createUser);
        app.post('/api/user/:id', this.middleware({scope: 'users', setProject: false}), this.postUser);
    }    
    
    /** 
     * Logs in a user
     */
    static login(req, res) {
        let username = req.body.username;
        let password = req.body.password;

        debug.log('Attempting login for user "' + username + '"...', UserHelper);

        UserHelper.loginUser(username, password)
        .then((token) => {
            res.status(200).send(token);
        })
        .catch((e) => {
            res.status(403).send(e);   
        });
    }

    /**
     * Get current scopes
     */
    static getScopes(req, res) {
        ApiController.authenticate(req.query.token)
        .then((user) => {
            res.send(user.scopes);
        })
        .catch((e) => {
            res.status(403).send(e);   
        });
    }
    
    /**
     * Get all users
     */
    static getUsers(req, res) {
        UserHelper.getAllUsers()
        .then((users) => {
            res.status(200).send(users);
        })
        .catch((e) => {
            res.status(403).send(e);   
        });
    }

    /**
     * Updates a user
     */
    static postUser(req, res) {
        let username = req.params.username;
        let user = req.body;

        UserHelper.updateUser(username, user)
        .then(() => {
            res.status(200).send(user);
        })
        .catch((e) => {
            res.status(403).send(e);   
        });
    }
    
    /**
     * Creates a user
     */
    static createUser(req, res) {
        let username = req.body.username;
        let password = req.body.password;

        UserHelper.createUser(username, password)
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((e) => {
            res.status(403).send(e);   
        });
    }
}

module.exports = UserController;
