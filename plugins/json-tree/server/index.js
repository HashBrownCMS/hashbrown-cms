'use strict';

let JsonTreeConnection = require('../common/models/JsonTreeConnection');
let ConnectionHelper = require(appRoot + '/src/server/helpers/ConnectionHelper');

class JsonTree {
    static init(app) {
        ConnectionHelper.registerConnectionType('JSON Tree', JsonTreeConnection);

        app.get('/api/:project/:environment/json/tree', this.getTree);
    }

    /**
     * Gets the entire tree
     */
    static getTree(req, res) {
        let options = {
            root: appRoot + '/projects/' + req.params.project + '/storage/' + req.params.environment + '/json/',
            dotFiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };

        res.sendFile('tree.json', options, (err) => {
            if(err) {
                debug.warning(err, this)
            }
        });
    }
}

module.exports = JsonTree;
