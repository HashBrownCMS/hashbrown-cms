'use strict';

const DebugHelperCommon = require('Common/Helpers/DebugHelper');

/**
 * The client side debug helper
 *
 * @memberof HashBrown.Client.Helpers
 */
class DebugHelper extends DebugHelperCommon {
    /**
     * Start the debug socket
     */
    static startSocket() {
        let debugSocket = new WebSocket(location.protocol.replace('http', 'ws') + '//' + location.host + '/api/debug');

        debugSocket.onopen = (ev) => {
            debug.log('Debug socket open', 'HashBrown');
        };

        debugSocket.onmessage = (ev) => {
            this.onSocketMessage(ev);
        };
    }

    /**
     * Event: On debug socket message
     */
    static onSocketMessage(ev) {
        try {
            let data = JSON.parse(ev.data);

            switch(data.type) {
                case 'error':
                    UI.errorModal(new Error(data.sender + ': ' + data.message));
                    break;

                case 'warning':
                    UI.errorModal(new Error(data.sender + ': ' + data.message));
                    break;
            }

        } catch(e) {
            UI.errorModal(ev);
        }
    }
}

module.exports = DebugHelper;
