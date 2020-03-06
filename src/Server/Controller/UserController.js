'use strict';

/**
 * The controller for Users
 *
 * @memberof HashBrown.Server.Controller
 */
class UserController extends HashBrown.Controller.ControllerBase {
    /**
     * Routes
     */
    static get routes() {
        return {
            // Current user
            '/api/user': {
                handler: this.current,
                user: true
            },
            '/api/user/scopes': {
                handler: this.scopes,
                user: true
            },
            '/api/user/login': {
                handler: this.login,
                methods: [ 'POST' ]
            },
            '/api/user/logout': {
                handler: this.logout,
                methods: [ 'POST' ]
            },
            
            // All users
            '/api/users/${id}': {
                handler: this.user,
                methods: [ 'GET', 'POST', 'DELETE' ],
                user: true
            },
            '/api/users': {
                handler: this.users,
                user: {
                    isAdmin: true
                }
            },

            // New users
            '/api/users/first': {
                handler:  this.first,
                methods: [ 'POST' ]
            },
            '/api/users/new': {
                handler: this.new,
                methods: [ 'POST' ],
                user: {
                    isAdmin: true
                }
            }
        };
    }    
    
    /**
     * Logs a user in
     *
     * @example POST /api/user/login
     *
     * @param {String} username
     * @param {String} password
     * @param {Boolean} persist
     *
     * @returns {String} Session token
     */
    static async login(request, params, body, query, user) {
        let username = body.username || query.username;
        let password = body.password || query.password;
        let persist = query.persist === 'true' || query.persist === true || body.persist === 'true' || body.persist === true;

        let token = await HashBrown.Service.UserService.loginUser(username, password, persist);

        return new HttpResponse(token, 200, { 'Set-Cookie': `token=${token}; path=/;` });
    }
    
    /** 
     * Logs out a user
     */
    static async logout(request, params, body, query, user) {
        await HashBrown.Service.UserService.logoutUser(user.id);

        return new HttpResponse('User logged out', 302, { 'Set-Cookie': 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT', 'Location': '/' });
    }
    
    /**
     * Gets current user
     */
    static async current(request, params, body, query, user) {
        user.clearSensitiveData();

        return new HttpResponse(user);
    }

    /**
     * Gets current scopes
     */
    static async scopes(request, params, body, query, user) {
        return new HttpResponse(user.scopes);
    }
    
    /**
     * Gets all users
     */
    static async users(request, params, body, query, user) {
        let users = await HashBrown.Service.UserService.getAllUsers();
    
        for(let i in users) {
            users[i].clearSensitiveData();
            users[i].isCurrent = users[i].id === user.id;
        }

        return new HttpResponse(users);
    }
    
    /**
     * Handles a single user request
     */
    static async user(request, params, body, query, user) {
        let id = params.id || body.id || query.id;

        switch(request.method) {
            case 'GET':
                let result = await HashBrown.Service.UserService.getUserById(id);

                if(!result) {
                    return new HttpError(`User by id ${id} not found`, 404);
                }
           
                result.clearSensitiveData();
                result.isCurrent = result.id === user.id;

                return new HttpResponse(result);

            case 'POST':
                if(user.id !== id && !user.isAdmin) {
                    return new HttpError('You do not have sufficient privileges to change this user\'s information', 403);
                }

                // Only admins can change scopes and admin status
                if(!user.isAdmin) {
                    delete body.scopes;
                    delete body.isAdmin;
                }

                // Theme can only be changed by current users
                if(user.id !== id) {
                    delete body.theme;
                }
            
                let updated = await HashBrown.Service.UserService.updateUserById(id, body);
            
                updated.clearSensitiveData();

                return new HttpResponse(updated);

            case 'DELETE':
                if(!user.isAdmin) {
                    return new HttpError('You do not have sufficient privileges to change this user\'s information', 403);
                }

                await HashBrown.Service.UserService.removeUser(id);
                return new HttpResponse('OK');
        }
            
        return new HttpResponse('Unexpected error', 500);
    }
    
    /**
     * Creates the first admin
     */
    static async first(request, params, body, query, user) {
        let username = body.username || query.username;
        let password = body.password || query.password;

        let users = await HashBrown.Service.UserService.getAllUsers();

        if(users && users.length > 0) {
            return new HttpError('Cannot create first admin, users already exist. If you lost your credentials, please assign the the admin from the command line.', 403);
        }

        await HashBrown.Service.UserService.createUser(username, password, true);
        
        let token = await HashBrown.Service.UserService.loginUser(username, password);
       
        return new HttpResponse(token, { 'Set-Cookie': `token=${token}` });
    }
    
    /**
     * Creates a user
     */
    static async new(request, params, body, query, user) {
        let username = body.username || query.username;
        let password = body.password || query.password;

        let newUser = await HashBrown.Service.UserService.createUser(username, password, false, body);

        newUser.clearSensitiveData();

        return new HttpResponse(newUser);
    }
}

module.exports = UserController;
