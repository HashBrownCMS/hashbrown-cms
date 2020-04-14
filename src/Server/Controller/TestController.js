'use strict';

/**
 * The controller for testing
 *
 * @memberof HashBrown.Server.Controller
 */
class TestController extends HashBrown.Controller.ControllerBase {
    /**
     * Routes
     */
    static get routes() {
        return {
            '/api/test': {
                handler: this.test,
                methods: [ 'POST' ],
                user: {
                    isAdmin: true,
                }
            }
        };
    }

    /**
     * @example POST /api/test
     */
    static async test(request, params, body, query, context) {
        let report = [];

        // Create a test project
        context.project = await HashBrown.Entity.Project.create('Test Project ' + Date.now());
        context.environment = 'live';
        
        report.push(`✔ Create test project "${context.project.getName()}"`);

        // Find classes with static test methods
        let testableClasses = this.getTestableClasses(HashBrown);

        // Run test methods
        let errors = 0;

        for(let testableClass of testableClasses) {
            if(
                testableClass === this ||
                typeof testableClass.test !== 'function'
            ) { continue; }
            
            report.push('');
            report.push('');
            
            report.push('[' + testableClass.name + ']');

            report.push('');
            
            try {
                await testableClass.test(context, (line) => {
                    report.push('✔ ' + line);
                });
            
            } catch(e) {
                report[report.length - 1] = '✖' + report[report.length - 1].substring(1);

                report.push('    ' + (e.stack || e.message));
                errors++;

            }
        }
        
        report.push('');
        report.push('');
        
        try {
            await context.project.remove();
            report.push('✔ Remove test project');

        } catch(e) {
            report.push('✖ Remove test project');
            report.push('    ' + (e.stack || e.message));
        
        }
        
        report.push('');
        report.push('');
        report.push('Test completed');

        if(errors > 0) {
            report[report.length - 1] += ` with ${errors} error${errors > 1 ? 's' : ''}`;
        }

        return new HashBrown.Http.Response(report.join('\n'));
    }

    /**
     * Gets testable classes in namespace
     *
     * @param {Object} namespace
     *
     * @return {Array} Classes
     */
    static getTestableClasses(namespace) {
        checkParam(namespace, 'namespace', Object);

        let classes = [];

        for(let subNamespaceName in namespace) {
            let subNamespace = namespace[subNamespaceName];

            if(typeof subNamespace === 'function') {
                if(typeof subNamespace.test === 'function') {
                    classes.push(subNamespace);
                }

            } else if(typeof subNamespace === 'object') {
                classes = classes.concat(this.getTestableClasses(subNamespace));

            }
        }

        classes.sort((a, b) => {
            a = a.name;
            b = b.name;

            return a === b ? 0 : a < b ? -1 : 1;
        });

        return classes;
    }
}

module.exports = TestController;
