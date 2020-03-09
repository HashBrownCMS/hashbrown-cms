'use strict';

/**
 * Controller for console input
 *
 * @memberof HashBrown.Server.Controller
 */
class InputController extends HashBrown.Controller.ControllerBase {
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

        // Create a new user
        if(cmd === 'create-user') {
            await HashBrown.Entity.User.create(args.u, args.p, { isAdmin: args.admin === 'true' });

        // Make a user an admin
        } else if(cmd === 'make-user-admin') {
            let user = await HashBrown.Entity.User.get(args.u);

            if(!user) {
                throw new Error(`User "${args.u}" not found`);
            }

            user.isAdmin = true;
            
            await user.save();

        // Revoke tokens for a user
        } else if(cmd === 'revoke-tokens') {
            let user = await HashBrown.Entity.User.get(args.u);

            if(!user) {
                throw new Error(`User "${args.u}" not found`);
            }

            user.tokens = [];

            await user.save();

        // Set scopes for a user
        } else if(cmd === 'set-user-scopes') {
            let user = await HashBrown.Entity.User.get(args.u);
            
            if(!user) {
                throw new Error(`User "${args.u}" not found`);
            }

            if(!user.scopes[args.p]) {
                user.scopes[args.p] = [];
            }

            user.scopes[args.p] = args.s.split(',');

            await user.save();

        // Change password for a user
        } else if(cmd === 'set-user-password') {
            let user = await HashBrown.Entity.User.get(args.u);
            
            if(!user) {
                throw new Error(`User "${args.u}" not found`);
            }

            user.setPassword(args.p);

            await user.save();
        
        // No arguments were recognised, skip this entire check
        } else { 
            return false;
        
        }

        // If any arguments were recognised, exit the process after execution
        process.exit();

        return true;
    }
}

module.exports = InputController;
