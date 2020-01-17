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
    static async login(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        let persist = req.query.persist == 'true' || req.query.persist == true;

        try {
            let token = await HashBrown.Service.UserService.loginUser(username, password, persist);

            res.status(200).cookie('token', token).send(token);
        
        } catch(e) {
            res.status(e.code || 403).send(e.message);
        
        }
    }
    
    /** 
     * Logs out a user
     */
    static async logout(req, res) {
        try {
            await HashBrown.Service.UserService.logoutUser(req.cookies.token);

            res.status(200).cookie('token', '').redirect('/');
        
        } catch(e) {
            res.status(e.code || 403).send(e.message);
        
        }
    }
    
    /**
     * Gets current user
     */
    static async getCurrentUser(req, res) {
        try {
            let user = await UserController.authenticate(req.cookies.token);

            user.clearSensitiveData();

            user = user.getObject();

            res.status(200).send(user);
        
        } catch(e) {
            res.status(e.code || 403).send(e.message);
        
        }
    }

    /**
     * Get current scopes
     */
    static async getScopes(req, res) {
        try {
            let user = await UserController.authenticate(req.cookies.token);
            
            res.send(user.scopes);
        
        } catch(e) {
            res.status(e.code || 403).send(e.message);
        
        }
    }
    
    /**
     * Get all users
     */
    static async getUsers(req, res) {
        let project = req.params.project;

        try {
            let users = await HashBrown.Service.UserService.getAllUsers(project);
        
            for(let i in users) {
                users[i].clearSensitiveData();
                users[i] = users[i].getObject();
                users[i].isCurrent = users[i].id === req.user.id;
            }

            res.status(200).send(users);
        
        } catch(e) {
            res.status(e.code || 403).send(e.message);   
        
        }
    }
    
    /**
     * Gets s specific user
     */
    static async getUser(req, res) {
        let id = req.params.id;

        try {
            let user = await HashBrown.Service.UserService.getUserById(id);

            if(!user) {
                throw new Error(`User by id ${id} not found`);
            }

            user.clearSensitiveData();
                
            user = user.getObject();
            
            user.isCurrent = user.id === req.user.id;

            res.status(200).send(user);
        
        } catch(e) {
            res.status(e.code || 404).send(e.message);   
        
        }
    }

    /**
     * Updates a user
     */
    static async postUser(req, res) {
        let id = req.params.id;
        let properties = req.body;

        try {
            let user = await UserController.authenticate(req.cookies.token);

            if(user.id !== id && !user.isAdmin) {
                throw new Error('You do not have sufficient privileges to change this user\'s information');
            }

            // Only admins can change scopes and admin status
            if(!user.isAdmin) {
                delete properties.scopes;
                delete properties.isAdmin;
            }

            // Theme can only be changed by current users
            if(user.id !== id) {
                delete properties.theme;
            }

            user = await HashBrown.Service.UserService.updateUserById(id, properties);
            
            user.clearSensitiveData();

            res.status(200).send(user);
        
        } catch(e) {
            res.status(e.code || 400).send(e.message);   
        
        }
    }
    
    /**
     * Deletes a user from the current project scope
     */
    static async deleteUser(req, res) {
        let id = req.params.id;

        try {
            await HashBrown.Service.UserService.removeUser(id);
            
            res.status(200).send('OK');
        
        } catch(e) {
            res.status(e.code || 502).send(e.message);
        
        }
    }
    
    /**
     * Creates the first admin
     */
    static async createFirstAdmin(req, res) {
        let username = req.body.username;
        let password = req.body.password;

        try {
            let users = await HashBrown.Service.UserService.getAllUsers();

            if(users && users.length > 0) {
                throw new Error('Cannot create first admin, users already exist. If you lost your credentials, please assign the the admin from the commandline.');
            }

            let user = await HashBrown.Service.UserService.createUser(username, password, true);
            let token = await HashBrown.Service.UserService.loginUser(username, password);
            
            res.status(200).cookie('token', token).send(token);
        
        } catch(e) {
            res.status(e.code || 403).send(e.message);   
        
        }
    }
    
    /**
     * Creates a user
     */
    static async createUser(req, res) {
        let username = req.body.username;
        let password = req.body.password;

        try {
            let user = await HashBrown.Service.UserService.createUser(username, password, false, req.body);

            user.clearSensitiveData();

            res.status(200).send(user);
        
        } catch(e) {
            res.status(e.code || 400).send(e.message);   
        
        }
    }
}

module.exports = UserController;
