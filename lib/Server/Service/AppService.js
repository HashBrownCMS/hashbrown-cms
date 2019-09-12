'use strict';

const ChildProcess = require('child_process');
const FileSystem = require('fs');

/**
 * The main class for basic app operations
 *
 * @memberof HashBrown.Server.Service
 */
class AppService {
    /**
     * Executes a console command
     *
     * @param {String} cmd
     * @param {String} cwd
     *
     * @returns {Promise} Result
     */
    static exec(cmd, cwd = '') {
        checkParam(cmd, 'cmd', String);
        checkParam(cwd, 'cwd', String);

        if(!cwd) { cwd = APP_ROOT; }

        return new Promise((resolve, reject) => {
            debug.log('Running command ' + cmd, this, 3);

            let process = ChildProcess.exec(cmd, { cwd: cwd });
            let result = '';
            let message = '';

            process.stdout.on('data', (data) => {
                result += data;
            });

            process.stderr.on('data', (data) => {
                message += data;
            });

            process.on('exit', (code) => {
                if(code === 0 || code === '0') {
                    resolve(result);
                } else {
                    reject(new Error('Process "' + cmd + '" in "' + cwd + '" exited with code ' + code + ': ' + message));
                }
            });
        });
    }

    /**
     * Processes CLI input
     */
    static async processInput() {
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
            return;
        
        }

        // If any arguments were recognised, exit the process after execution
        process.exit();
    }
}

module.exports = AppService;
