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

        return ApiController.authenticate(req.cookies.token, project, environment, true)
        .then((user) => {
            ws.on('message', (msg) => {
                if(msg !== 'start') { return; }

                let onMessage = (msg) => {
                    ws.send(msg);
                };

                ws.send('Testing ContentHelper...');
                TestHelper.testContentHelper(project, environment, user, onMessage)
                .then(() => {
                    ws.send('Testing SchemaHelper...');
                    return TestHelper.testSchemaHelper(project, environment, user, onMessage);
                })
                .then(() => {
                    ws.send('done');
                })
                .catch((e) => {
                    console.log(e.stack);
                    ws.send(e.message);
                });
            });
        })
        .catch((e) => {
            console.log(e.stack);
            ws.send(e.message);
        });
    }
}

module.exports = TestController;
