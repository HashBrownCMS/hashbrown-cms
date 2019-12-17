'use strict';

/**
 * The controller for Users
 *
 * @memberof HashBrown.Server.Controller
 */
class UserController extends HashBrown.Controller.ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        // Current user
        app.get('/api/user', this.getCurrentUser);
        app.get('/api/user/scopes', this.getScopes);
        
        app.post('/api/user/login', this.login);
        app.post('/api/user/logout', this.logout);
        
        // Dashboard
        app.get('/api/users/:id', this.middleware({needsAdmin: true, setProject: false}), this.getUser);
        app.get('/api/users', this.middleware({needsAdmin: true, setProject: false}), this.getUsers);

        app.post('/api/users/first', this.createFirstAdmin);
        app.post('/api/users/new', this.middleware({setProject: false, needsAdmin: true}), this.createUser);
        app.post('/api/users/:id', this.middleware({setProject: false}), this.postUser);
        
        app.delete('/api/users/:id', this.middleware({setProject: false, needsAdmin: true}), this.deleteUser);
        
        // Environment
        app.get('/api/:project/:environment/users', this.middleware(), this.getUsers);
        app.get('/api/:project/:environment/users/:id', this.middleware(), this.getUser);
        
        app.post('/api/:project/:environment/users/:id', this.middleware(), this.postUser);
    }    
    
    /**
     * @example POST /api/user/login
     *
     * @apiGroup User
     *
     * @param {Object} credentials { username: String, password: String } 
     *
     * @param {String} persist "true"/"false"
     *
     * @returns {String} Session token
     */
    static login(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        let persist = req.query.persist == 'true' || req.query.persist == true;

        HashBrown.Service.UserService.loginUser(username, password, persist)
        .then((token) => {
            res.status(200).cookie('token', token).send(token);
        })
        .catch((e) => {
            res.status(403).send(UserController.printError(e));   
        });
    }
    
    /** 
     * Logs out a user
     */
    static logout(req, res) {
        HashBrown.Service.UserService.logoutUser(req.cookies.token)
        .then(() => {
            res.status(200).cookie('token', '').redirect('/');
        })
        .catch((e) => {
            res.status(403).send(UserController.printError(e));   
        });
    }
    
    /**
     * Gets current user
     */
    static getCurrentUser(req, res) {
        UserController.authenticate(req.cookies.token)
        .then((user) => {
            user = user.getObject();

            delete user.tokens;
            delete user.password;

            res.status(200).send(user);
        })
        .catch((e) => {
            res.status(403).send(UserController.printError(e));   
        });
    }

    /**
     * Get current scopes
     */
    static getScopes(req, res) {
        UserController.authenticate(req.cookies.token)
        .then((user) => {
            res.send(user.scopes);
        })
        .catch((e) => {
            res.status(403).send(UserController.printError(e));   
        });
    }
    
    /**
     * Get all users
     */
    static getUsers(req, res) {
        let project = req.params.project;

        HashBrown.Service.UserService.getAllUsers(project)
        .then((users) => {
            for(let i in users) {
                users[i] = users[i].getObject();
                users[i].isCurrent = users[i].id == req.user.id;

                delete users[i].tokens;
                delete users[i].password;
            }

            res.status(200).send(users);
        })
        .catch((e) => {
            res.status(403).send(UserController.printError(e));   
        });
    }
    
    /**
     * Gets s specific user
     */
    static getUser(req, res) {
        let id = req.params.id;

        HashBrown.Service.UserService.getUserById(id)
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((e) => {
            res.status(404).send(e.message);   
        });
    }

    /**
     * Updates a user
     */
    static postUser(req, res) {
        let id = req.params.id;
        let properties = req.body;

        UserController.authenticate(req.cookies.token, req.params.project)
        .then((user) => {
            let hasScope = user.hasScope(req.params.project, 'users');

            if(user.id == id || hasScope) {
                // If the current user does not have the "users" scope, revert any sensitive properties
                if(!hasScope) {
                    properties.scopes = user.scopes;
                    properties.isAdmin = false;
                }

                return Promise.resolve();
            }

            return Promise.reject(new Error('User "' + user.name + '" does not have scope "user"'));
        })
        .then(() => {
            HashBrown.Service.UserService.updateUserById(id, properties);
        })
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((e) => {
            res.status(400).send(UserController.printError(e));   
        });
    }
    
    /**
     * Deletes a user from the current project scope
     */
    static deleteUser(req, res) {
        let id = req.params.id;

        HashBrown.Service.UserService.removeUser(id)
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((e) => {
            res.status(502).send(UserController.printError(e));
        });
    }
    
    /**
     * Creates the first admin
     */
    static createFirstAdmin(req, res) {
        let username = req.body.username;
        let password = req.body.password;

        HashBrown.Service.UserService.getAllUsers()
        .then((users) => {
            if(users && users.length > 0) {
                return Promise.reject(new Error('Cannot create first admin, users already exist. If you lost your credentials, please assign the the admin from the commandline.'));
            }

            return HashBrown.Service.UserService.createUser(username, password, true);
        })
        .then((user) => {
            return HashBrown.Service.UserService.loginUser(username, password);
        })
        .then((token) => {
            res.status(200).cookie('token', token).send(token);
        })
        .catch((e) => {
            res.status(403).send(UserController.printError(e));   
        });
    }
    
    /**
     * Creates a user
     */
    static createUser(req, res) {
        let username = req.body.username;
        let password = req.body.password;

        HashBrown.Service.UserService.createUser(username, password, false, req.body)
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((e) => {
            res.status(400).send(UserController.printError(e));   
        });
    }
}

module.exports = UserController;
