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
        
        app.get('/api/:project/:environment/users', this.middleware({scope: 'users', setProject: false}), this.getUsers);
        app.post('/api/:project/:environment/users/new', this.middleware({scope: 'users', setProject: false}), this.createUser);
        app.get('/api/:project/:environment/users/:id', this.middleware({scope: 'users', setProject: false}), this.getUser);
        app.post('/api/:project/:environment/users/:id', this.middleware({scope: 'users', setProject: false}), this.postUser);
        app.delete('/api/:project/:environment/users/:id', this.middleware({scope: 'users', setProject: false}), this.deleteUser);
    }    
    
    /** 
     * Logs in a user
     */
    static login(req, res) {
        let username = req.body.username;
        let password = req.body.password;

        UserHelper.loginUser(username, password)
        .then((token) => {
            res.status(200).send(token);
        })
        .catch((e) => {
            res.status(403).send(e.message);   
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
        let project = req.params.project;

        UserHelper.getAllUsers(project)
        .then((users) => {
            res.status(200).send(users);
        })
        .catch((e) => {
            res.status(403).send(e);   
        });
    }
    
    /**
     * Gets s specific user
     */
    static getUser(req, res) {
        let id = req.params.id;

        UserHelper.getUserById(id)
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((e) => {
            res.status(403).send(e);   
        });
    }

    /**
     * Updates a user
     */
    static postUser(req, res) {
        let id = req.params.id;
        let user = req.body;

        UserHelper.updateUserById(id, user)
        .then(() => {
            res.status(200).send(user);
        })
        .catch((e) => {
            res.status(403).send(e);   
        });
    }
    
    /**
     * Deletes a user from the current project scope
     */
    static deleteUser(req, res) {
        let id = req.params.id;
        let scope = req.params.project;

        UserHelper.removeUserProjectScope(id, scope)
        .then((user) => {
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
        let scopes = req.body.scopes;

        UserHelper.createUser(username, password, scopes)
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((e) => {
            res.status(403).send(e);   
        });
    }
}

module.exports = UserController;
