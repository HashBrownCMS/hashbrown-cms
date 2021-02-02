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
            },
            'test': {
                handler: this.test
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
            await this.routes[cmd].handler.call(this, args);

        } catch(e) {
            debug.error(e, this);
        
        } finally {
            process.exit();
        
        }
    }

    /**
     * Creates a user account
     *
     * @example create-user u=XXX p=XXX admin=true|false
     */
    static async createUser(args) {
        if(!args.u || !args.p) {
            throw new Error('Usage: create-user u=USERNAME p=PASSWORD [admin=true|false]');
        }
        
        await HashBrown.Entity.User.create(args.u, args.p, { isAdmin: args.admin === 'true' });
    }

    /**
     * Makes an existing user an admin
     *
     * @example make-user-admin u=XXX
     */
    static async makeUserAdmin(args) {
        if(!args.u) {
            throw new Error('Usage: make-user-admin u=USERNAME');
        }
        
        let user = await HashBrown.Entity.User.getByUsername(args.u);

        if(!user) {
            throw new Error(`User "${args.u}" not found`);
        }

        user.isAdmin = true;

        await user.save();
    }

    /**
     * Revokes all session tokens from a user
     *
     * @example revoke-tokens u=XXX
     */
    static async revokeTokens(args) {
        if(!args.u) {
            throw new Error('Usage: revoke-tokens u=USERNAME');
        }
        
        let user = await HashBrown.Entity.User.getByUsername(args.u);

        if(!user) {
            throw new Error(`User "${args.u}" not found`);
        }

        user.tokens = [];

        await user.save();
    }

    /**
     * Changes the scopes for a user
     *
     * @example set-user-scopes u=XXX p=XXX s=XXX,XXX,XXX
     */
    static async setUserScopes(args) {
        if(!args.u || !args.p || !args.s) {
            throw new Error('Usage: set-user-scopes u=USERNAME p=PROJECT s=SCOPE1,SCOPE2,...');
        }
        
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
     * Sets the password for a user
     *
     * @example set-user-password u=XXX p=XXX
     */
    static async setUserPassword(args) {
        if(!args.u || !args.p) {
            throw new Error('Usage: set-user-password u=USERNAME p=PASSWORD');
        }
        
        let user = await HashBrown.Entity.User.getByUsername(args.u);
        
        if(!user) {
            throw new Error(`User "${args.u}" not found`);
        }

        user.setPassword(args.p);

        await user.save();
    }

    /**
     * Runs unit tests
     *
     * @example test u=XXX p=XXX
     */
    static async test(args) {
        if(!args.u || !args.p) {
            throw new Error('Usage: test u=USERNAME p=PASSWORD');
        }

        let user = await HashBrown.Entity.User.getByUsername(args.u, { withPassword: true });

        if(!user) {
            throw new Error('User not found');
        }

        if(!user.validatePassword(args.p)) {
            throw new Error('Invalid password');
        }
        
        // Establish context
        let context = HashBrown.Entity.Context.new({
            user: user,
            config: await HashBrown.Service.ConfigService.get(),
            locales: await HashBrown.Service.LocaleService.getSystemLocales(),
            project: await HashBrown.Entity.Project.create('Test Project ' + Date.now()),
            environment: 'live'
        });

        // Create a test project
        
        debug.log(`Create test project "${context.project.getName()}"`, HashBrown.Entity.Project);

        // Find classes with static test methods
        let getTestableClasses = (namespace) => {
            checkParam(namespace, 'namespace', Object);

            let classes = [];

            for(let subNamespaceName in namespace) {
                let subNamespace = namespace[subNamespaceName];

                if(typeof subNamespace === 'function') {
                    if(typeof subNamespace.test === 'function') {
                        classes.push(subNamespace);
                    }

                } else if(typeof subNamespace === 'object') {
                    classes = classes.concat(getTestableClasses(subNamespace));

                }
            }

            classes.sort((a, b) => {
                a = a.name;
                b = b.name;

                return a === b ? 0 : a < b ? -1 : 1;
            });

            return classes;
        }

        let testableClasses = getTestableClasses(HashBrown);

        // Run test methods
        let errors = 0;

        for(let testableClass of testableClasses) {
            if(
                testableClass === this ||
                typeof testableClass.test !== 'function'
            ) { continue; }
            
            try {
                await testableClass.test(context, (line) => {
                    debug.log(line, testableClass);
                });
            
            } catch(e) {
                debug.error(e, testableClass);
                
                errors++;

            }
        }
        
        try {
            await context.project.remove();
            
            debug.log('Remove test project', HashBrown.Entity.Project);

        } catch(e) {
            debug.error(e, HashBrown.Entity.Project);
        
        }
        
        if(errors > 0) {
            debug.log(`Test completed with ${errors} error${errors > 1 ? 's' : ''}`, 'HashBrown');

        } else {
            debug.log('Test completed', 'HashBrown');

        }
    }
}

module.exports = InputController;
