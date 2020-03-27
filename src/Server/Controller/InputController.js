'use strict';

/**
 * Controller for console input
 *
 * @memberof HashBrown.Server.Controller
 */
class InputController extends HashBrown.Controller.ControllerBase {
    /**
     * Routes
     */
    static get routes() {
        return {
            'create-user': {
                handler: this.createUser
            },
            'make-user-admin': {
                handler: this.makeUserAdmin
            },
            'revoke-tokens': {
                handler: this.revokeTokens
            },
            'set-user-scopes': {
                handler: this.setUserScopes
            },
            'set-user-password': {
                handler: this.setUserPassword
            }
        }
    }

    /**
     * Handles a request
     */
    static async handle() {
        let cmd = process.argv[2];
        let args = {};

        for(let k in process.argv) {
            let v = process.argv[k];

            let matches = v.match(/(\w+)=(.+)/);

            if(matches) {
                args[matches[1]] = matches[2];
            }
        }

        if(!this.routes[cmd] || typeof this.routes[cmd].handler !== 'function') { return; }

        try {
            await this.routes[cmd].handler(args);
        } catch(e) {
            console.log(e.message);
        } finally {
            process.exit();
        }
    }

    /**
     * @example create-user u=XXX p=XXX admin=true|false
     */
    static async createUser(args) {
        await HashBrown.Entity.User.create(args.u, args.p, { isAdmin: args.admin === 'true' });
    }

    /**
     * @example make-user-admin u=XXX
     */
    static async makeUserAdmin(args) {
        let user = await HashBrown.Entity.User.getByUsername(args.u);

        if(!user) {
            throw new Error(`User "${args.u}" not found`);
        }

        user.isAdmin = true;

        await user.save();
    }

    /**
     * @example revoke-tokens u=XXX
     */
    static async revokeTokens(args) {
        let user = await HashBrown.Entity.User.getByUsername(args.u);

        if(!user) {
            throw new Error(`User "${args.u}" not found`);
        }

        user.tokens = [];

        await user.save();
    }

    /**
     * @example set-user-scopes u=XXX p=XXX s=XXX,XXX,XXX
     */
    static async setUserScopes(args) {
        let user = await HashBrown.Entity.User.getByUsername(args.u);
        
        if(!user) {
            throw new Error(`User "${args.u}" not found`);
        }

        if(!user.scopes[args.p]) {
            user.scopes[args.p] = [];
        }

        user.scopes[args.p] = args.s.split(',');

        await user.save();
    }

    /**
     * @example set-user-password u=XXX p=XXX
     */
    static async setUserPassword(args) {
        let user = await HashBrown.Entity.User.getByUsername(args.u);
        
        if(!user) {
            throw new Error(`User "${args.u}" not found`);
        }

        user.setPassword(args.p);

        await user.save();
    }
}

module.exports = InputController;
