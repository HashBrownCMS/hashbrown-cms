'use strict';

let ApiController = require('./ApiController');

class UserController extends ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/user', this.getCurrentUser);
        app.get('/api/user/scopes', this.getScopes);
        app.get('/api/users', this.middleware({needsAdmin: true, setProject: false}), this.getUsers);
        app.get('/api/:project/:environment/users', this.middleware(), this.getUsers);
        app.get('/api/:project/:environment/users/:id', this.middleware(), this.getUser);
        
        app.post('/api/user/invite', this.middleware({needsAdmin: true, setProject: false}), this.postInvite);
        app.post('/api/user/activate', this.postActivate);
        app.post('/api/user/login', this.login);
        app.post('/api/user/logout', this.logout);
        app.post('/api/user/first', this.createFirstAdmin);
        app.post('/api/user/new', this.middleware({setProject: false, needsAdmin: true}), this.createUser);
        app.post('/api/user/:id', this.middleware({setProject: false}), this.postUser);
        app.post('/api/:project/:environment/user/:id', this.middleware(), this.postUser);
        
        app.delete('/api/user/:id', this.middleware({setProject: false, needsAdmin: true}), this.deleteUser);
    }    
    
    /**
     * Activates an invited user
     */
    static postActivate(req, res) {
        let username = req.body.username;
        let fullName = req.body.fullName;
        let password = req.body.password;
        let inviteToken = req.body.inviteToken;

        UserHelper.activateUser(username, password, fullName, inviteToken)
        .then((token) => {
            res.status(200).cookie('token', token).send(token);
        })
        .catch((e) => {
            res.status(403).send(UserController.printError(e));
        });
    }

    /**
     * Invites a user
     */
    static postInvite(req, res) {
        UserHelper.invite(req.body.email, req.body.project)
        .then((msg) => {
            res.status(200).send(msg);
        })
        .catch((e) => {
            res.status(502).send(UserController.printError(e));
        });
    } 

    /** 
     * Logs in a user
     */
    static login(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        let persist = req.query.persist == 'true' || req.query.persist == true;

        UserHelper.loginUser(username, password, persist)
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
        UserHelper.logoutUser(req.cookies.token)
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
        ApiController.authenticate(req.cookies.token)
        .then((user) => {
            user = user.getObject();

            delete user.tokens;
            delete user.inviteToken;
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
        ApiController.authenticate(req.cookies.token)
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

        UserHelper.getAllUsers(project)
        .then((users) => {
            for(let i in users) {
                users[i] = users[i].getObject();
                users[i].isCurrent = users[i].id == req.user.id;

                delete users[i].tokens;
                delete users[i].inviteToken;
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

        UserHelper.getUserById(id)
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((e) => {
            res.status(403).send(UserController.printError(e));   
        });
    }

    /**
     * Updates a user
     */
    static postUser(req, res) {
        let id = req.params.id;
        let properties = req.body;

        ApiController.authenticate(req.cookies.token, req.params.project)
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

            return Promise.reject(new Error('User "' + user.name + '" does not have scope "users"'));
        })
        .then(() => {
            UserHelper.updateUserById(id, properties);
        })
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((e) => {
            res.status(403).send(UserController.printError(e));   
        });
    }
    
    /**
     * Deletes a user from the current project scope
     */
    static deleteUser(req, res) {
        let id = req.params.id;

        UserHelper.removeUser(id)
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

        UserHelper.getAllUsers()
        .then((users) => {
            if(users && users.length > 0) {
                return Promise.reject(new Error('Cannot create first admin, users already exist. If you lost your credentials, please create the new admin with the server console.'));
            }

            return UserHelper.createUser(username, password, true);
        })
        .then((user) => {
            return UserHelper.loginUser(username, password);
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
        let scopes = req.body.scopes;

        UserHelper.createUser(username, password, false, scopes)
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((e) => {
            res.status(403).send(UserController.printError(e));   
        });
    }
}

module.exports = UserController;
