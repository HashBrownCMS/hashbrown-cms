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
    static async test(request, params, body, query, user) {
        let report = [];

        // Create a test project
        let project = await HashBrown.Entity.Project.create('test ' + new Date().toString());
        
        report.push('✔ Create test project');

        // Find classes with static test methods
        let testableClasses = [];

        this.getTestableClasses(HashBrown, testableClasses);

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
                await testableClass.test(user, project, (line) => {
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
            await project.remove();
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

        return new HttpResponse(report.join('\n'));
    }

    /**
     * Gets testable classes in namespace
     *
     * @param {Object} namespace
     * @param {Array} Classes
     */
    static getTestableClasses(namespace, classes) {
        checkParam(namespace, 'namespace', Object);

        for(let subNamespaceName in namespace) {
            let subNamespace = namespace[subNamespaceName];

            if(typeof subNamespace === 'function') {
                if(typeof subNamespace.test === 'function') {
                    classes.push(subNamespace);
                }

            } else if(typeof subNamespace === 'object') {
                this.getTestableClasses(subNamespace, classes);

            }
        }
    }
}

module.exports = TestController;
