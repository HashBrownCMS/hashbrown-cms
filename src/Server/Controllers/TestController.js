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
        app.ws('/api/test', this.wsTest);
    }

    /**
     * Starts up the testing process
     */
    static wsTest(ws, req) {
        return TestController.authenticate(req.cookies.token, null, null, true)
        .then((user) => {
            if(!user.isAdmin) {
                return Promise.reject(new Error('The testing tool requires admin privileges'));
            }

            ws.on('message', (msg) => {
                if(msg !== 'start') { return; }

                let onMessage = (msg, isSection) => {
                    ws.send(JSON.stringify({message: msg, isSection: isSection}));
                };
                
                let onError = (e) => {
                    ws.send(JSON.stringify({error: e.message}));

                    console.log(e.stack);

                    return Promise.resolve();
                };
                
                let onDone = (msg) => {
                    ws.send(JSON.stringify({isDone: true}));
                };

                let testProject;
                let project = null;
                let environment = 'live';

                onMessage('Creating test project...', true);
                return HashBrown.Helpers.ProjectHelper.createProject('test ' + new Date().toString(), user.id)
                .then((newProject) => {
                    testProject = newProject;
                    project = newProject.id;

                    onMessage('Testing BackupHelper...', true);
                    return HashBrown.Helpers.TestHelper.testBackupHelper(project, onMessage)
                }).catch(onError)
                .then(() => {
                    onMessage('Testing ConnectionHelper...', true);
                    return HashBrown.Helpers.TestHelper.testConnectionHelper(project, environment, onMessage);
                }).catch(onError)
                .then(() => {
                    onMessage('Testing ContentHelper...', true);
                    return HashBrown.Helpers.TestHelper.testContentHelper(project, environment, user, onMessage);
                }).catch(onError)
                .then(() => {
                    onMessage('Testing FormHelper...', true);
                    return HashBrown.Helpers.TestHelper.testFormHelper(project, environment, onMessage);
                }).catch(onError)
                .then(() => {
                    onMessage('Testing SchemaHelper...', true);
                    return HashBrown.Helpers.TestHelper.testSchemaHelper(project, environment, onMessage);
                }).catch(onError)
                .then(() => {
                    onMessage('Testing ProjectHelper...', true);
                    return HashBrown.Helpers.TestHelper.testProjectHelper(testProject, onMessage);
                }).catch(onError)
                .then(() => {
                    onDone();
                }).catch(onError);
            });
        })
        .catch((e) => {
            ws.send(e.message);
        });
    }
}

module.exports = TestController;
