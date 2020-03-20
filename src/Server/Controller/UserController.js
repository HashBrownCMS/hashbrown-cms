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
            }
        };
    }    
    
    /**
     * @example POST /api/user/login?username=XXX&password=XXX&persist=true|false { username: XXX, password: XXX, persist: true|false }
     *
     * @return {String} Session token
     */
    static async login(request, params, body, query, user) {
        let username = body.username || query.username;
        let password = body.password || query.password;
        let persist = query.persist === 'true' || query.persist === true || body.persist === 'true' || body.persist === true;

        let token = await HashBrown.Entity.User.login(username, password, persist);

        return new HttpResponse(token, 200, { 'Set-Cookie': `token=${token}; path=/;` });
    }
    
    /** 
     * @example POST /api/user/logout
     */
    static async logout(request, params, body, query, user) {
        let token = this.getToken(request); 
        
        await user.logout(token);

        return new HttpResponse('User logged out', 302, { 'Set-Cookie': 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT', 'Location': '/' });
    }
    
    /**
     * @example GET /api/user
     */
    static async current(request, params, body, query, user) {
        user.tokens = [];
        user.password = null;

        return new HttpResponse(user);
    }

    /**
     * @example GET /api/user/scopes
     */
    static async scopes(request, params, body, query, user) {
        return new HttpResponse(user.scopes);
    }
    
    /**
     * @example GET /api/users
     */
    static async users(request, params, body, query, user) {
        let users = await HashBrown.Entity.User.list();
    
        return new HttpResponse(users);
    }
    
    /**
     * @example GET|POST|DELETE /api/users/${id}
     */
    static async user(request, params, body, query, user) {
        let subject = null;

        switch(request.method) {
            case 'GET':
                subject = await HashBrown.Entity.User.get(params.id);

                if(!subject) {
                    return new HttpError(`User by id ${id} not found`, 404);
                }
                
                return new HttpResponse(subject);

            case 'POST':
                subject = await HashBrown.Entity.User.get(params.id, { withTokens: true, withPassword: true });

                if(!subject) {
                    return new HttpError(`User by id ${id} not found`, 404);
                }
                
                if(subject.id !== user.id && !user.isAdmin) {
                    return new HttpError('You do not have sufficient privileges to change this user\'s information', 403);
                }

                // Only admins can change scopes and admin status
                if(!user.isAdmin) {
                    delete body.scopes;
                    delete body.isAdmin;
                }

                // Theme can only be changed by current users
                if(subject.id !== user.id) {
                    delete body.theme;
                }
       
                // Remove unsafe fields
                delete body.id;
                delete body.tokens;
                delete body.password;

                // Adopt values
                subject.adopt(body);

                // Save user
                await subject.save(query);

                return new HttpResponse('OK');

            case 'DELETE':
                if(!user.isAdmin) {
                    return new HttpError('You do not have sufficient privileges to change this user\'s information', 403);
                }

                subject = await HashBrown.Entity.User.get(params.id);

                if(!subject) {
                    return new HttpError(`User by id ${id} not found`, 404);
                }
                
                await subject.remove();
                
                return new HttpResponse('OK');
        }
            
        return new HttpResponse('Unexpected error', 500);
    }
    
    /**
     * @example POST /api/users/first?username=XXX&password=XXX { username: XXX, password: XXX }
     */
    static async first(request, params, body, query) {
        let username = body.username || query.username;
        let password = body.password || query.password;

        let users = await HashBrown.Entity.User.list();

        if(users && users.length > 0) {
            return new HttpError('Cannot create first admin, users already exist. If you lost your credentials, please assign the the admin from the command line.', 403);
        }

        let user = await HashBrown.Entity.User.create(username, password, { isAdmin: true });
        let token = await HashBrown.Entity.User.login(username, password);
       
        return new HttpResponse(token, 200, { 'Set-Cookie': `token=${token}; path=/;` });
    }
    
    /**
     * @example /api/users/new?username=XXX&password=XXX { username: XXX, password: XXX }
     */
    static async new(request, params, body, query, user) {
        let username = body.username || query.username;
        let password = body.password || query.password;

        let newUser = await HashBrown.Entity.User.create(username, password);

        return new HttpResponse(newUser);
    }
}

module.exports = UserController;
