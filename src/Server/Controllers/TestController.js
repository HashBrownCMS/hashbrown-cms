'use strict';

/**
 * The Controller for testing
 *
 * @memberof HashBrown.Server.Controllers
 */
class TestController extends HashBrown.Controllers.ApiController {
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
            let user = await TestController.authenticate(req.cookies.token, null, null, true);

            if(!user.isAdmin) {
                throw new Error('The testing tool requires admin privileges');
            }
            
            let environment = 'live';

            onMessage('Creating test project...', true);
            
            let testProject = await HashBrown.Helpers.ProjectHelper.createProject('test ' + new Date().toString(), user.id);

            onMessage('Testing BackupHelper...', true);
                
            await HashBrown.Helpers.TestHelper.testBackupHelper(testProject.id, onMessage);

            onMessage('Testing ConnectionHelper...', true);

            await HashBrown.Helpers.TestHelper.testConnectionHelper(testProject.id, environment, onMessage);

            onMessage('Testing ContentHelper...', true);
            
            await HashBrown.Helpers.TestHelper.testContentHelper(testProject.id, environment, user, onMessage);

            onMessage('Testing FormHelper...', true);
            
            await HashBrown.Helpers.TestHelper.testFormHelper(testProject.id, environment, onMessage);

            onMessage('Testing SchemaHelper...', true);
            
            await HashBrown.Helpers.TestHelper.testSchemaHelper(testProject.id, environment, onMessage);

            onMessage('Testing ProjectHelper...', true);
            
            await HashBrown.Helpers.TestHelper.testProjectHelper(testProject.id, onMessage);

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
