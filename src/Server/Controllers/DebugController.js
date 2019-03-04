'use strict';

/**
 * The Controller for debugging
 *
 * @memberof HashBrown.Server.Controllers
 */
class DebugController extends HashBrown.Controllers.ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.ws('/api/debug', this.wsDebug);
    }        
    
    /**
     * Gets debug socket
     */
    static wsDebug(ws, req) {
        return DebugController.authenticate(req.cookies.token, null, null)
        .then((user) => {
            debug.setLogHandler('websocket', (dateString, senderString, message, type) => {
                // We only want warnings and errors
                if(!type) { return; }

                // TODO: Make this check nicer
                try {
                    ws.send(JSON.stringify({
                        date: dateString,
                        sender: senderString,
                        message: message,
                        type: type
                    }));
                
                // This should only fail if the socket is not open
                } catch(e) {

                }
            });
        })
        .catch((e) => {
            ws.send(e.message);
        });
    }
}

module.exports = DebugController;
