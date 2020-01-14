'use strict';

/**
 * The Controller for testing
 *
 * @memberof HashBrown.Server.Controller
 */
class TestController extends HashBrown.Controller.ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.post('/api/test', this.postTest);
    }

    /**
     * Starts up the testing process
     */
    static async postTest(req, res) {
        let output = '';

        let onMessage = (message, isSection) => {
            if(isSection) {
                output += '\n';
                output += '--------------------\n';
            }

            output += message + '\n';
            
            if(isSection) {
                output += '--------------------\n';
            }
        }
        
        try {
            let user = await TestController.authenticate(req.cookies.token);

            if(!user.isAdmin) {
                throw new Error('The testing tool requires admin privileges');
            }
            
            let environment = 'live';

            onMessage('Creating test project...', true);
            
            let testProject = await HashBrown.Service.ProjectService.createProject('test ' + new Date().toString(), user.id);

            onMessage('Testing BackupService...', true);
                
            await HashBrown.Service.TestService.testBackupService(testProject.id, onMessage);

            onMessage('Testing ConnectionService...', true);

            await HashBrown.Service.TestService.testConnectionService(testProject.id, environment, onMessage);

            onMessage('Testing ContentService...', true);
            
            await HashBrown.Service.TestService.testContentService(testProject.id, environment, user, onMessage);

            onMessage('Testing FormService...', true);
            
            await HashBrown.Service.TestService.testFormService(testProject.id, environment, onMessage);

            onMessage('Testing SchemaService...', true);
            
            await HashBrown.Service.TestService.testSchemaService(testProject.id, environment, onMessage);

            onMessage('Testing ProjectService...', true);
            
            await HashBrown.Service.TestService.testProjectService(testProject.id, onMessage);

            onMessage('Done!', true);

        } catch(e) {
            if(e.stack) {
                onMessage(e.stack);
            } else {
                onMessage('Error: ' + e.message);
            }
        
        }
            
        res.status(200).send(output);
    }
}

module.exports = TestController;
