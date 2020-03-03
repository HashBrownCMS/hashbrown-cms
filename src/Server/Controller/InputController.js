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
            await HashBrown.Service.UserService.createUser(args.u, args.p, args.admin === 'true');

        // Make a user an admin
        } else if(cmd === 'make-user-admin') {
            await HashBrown.Service.UserService.makeUserAdmin(args.u);

        // Revoke tokens for a user
        } else if(cmd === 'revoke-tokens') {
            await HashBrown.Service.UserService.revokeTokens(args.u);

        // Set scopes for a user
        } else if(cmd === 'set-user-scopes') {
            let user = await HashBrown.Service.UserService.findUser(args.u)
            let obj = user.getObject();

            if(!obj.scopes[args.p]) {
                obj.scopes[args.p] = [];
            }

            obj.scopes[args.p] = args.s.split(',');

            await HashBrown.Service.UserService.updateUser(args.u, obj);

        // Change password for a user
        } else if(cmd === 'set-user-password') {
            let user = await HashBrown.Service.UserService.findUser(args.u);

            user.setPassword(args.p);

            await HashBrown.Service.UserService.updateUser(args.u, user.getObject());
        
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
