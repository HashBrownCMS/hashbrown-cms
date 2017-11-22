'use strict';

const ApiController = require('./ApiController');
const TestHelper = require('Server/Helpers/TestHelper');

/**
 * The Controller for testing
 *
 * @memberof HashBrown.Server.Controllers
 */
class TestController extends ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.ws('/api/:project/:environment/test', this.wsTest);
    }

    /**
     * Starts up the testing process
     */
    static wsTest(ws, req) {
        let project = req.params.project;
        let environment = req.params.environment;

        return TestController.authenticate(req.cookies.token, project, environment, true)
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

                onMessage('Testing BackupHelper...', true);
                return TestHelper.testBackupHelper(project, onMessage)
                .catch(onError)
                .then(() => {
                    onMessage('Testing ConnectionHelper...', true);
                    return TestHelper.testConnectionHelper(project, environment, onMessage);
                }).catch(onError)
                .then(() => {
                    onMessage('Testing ContentHelper...', true);
                    return TestHelper.testContentHelper(project, environment, user, onMessage);
                }).catch(onError)
                .then(() => {
                    onMessage('Testing FormHelper...', true);
                    return TestHelper.testFormHelper(project, environment, onMessage);
                }).catch(onError)
                .then(() => {
                    onMessage('Testing SchemaHelper...', true);
                    return TestHelper.testSchemaHelper(project, environment, onMessage);
                }).catch(onError)
                .then(() => {
                    onMessage('Testing ProjectHelper...', true);
                    return TestHelper.testProjectHelper(user, onMessage);
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
