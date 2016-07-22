'use strict';

let config = require('./config.json');

class Controller {
    /**
     * Inits the driver
     *
     * @param {Object} app Express.js app object
     */
    static init(app) {
        app.get('/hashbrown/content/tree', this.getTree);
    }

    /**
     * Authorise a call
     */
    static authorize(req, res, next) {
        if(req.query.token == config.token) {
            next();
        } else {
            res.status(402).send('Invalid token provided "' + req.query.token + '"');
        }
    }

    /**
     * Gets the entire content tree
     */
    static getTree(req, res) {
        HashBrown.getTree()
        .then((tree) => {
            res.status(200).send(tree);
        })
        .catch((e) => {
            res.status(502).send(e.message);
        });
    }
    
    /**
     * Sets the entire content tree
     */
    static postTree(req, res) {
        let tree = req.body;

        HashBrown.setTree(tree)
        .then((message) => {
            res.status(200).send(message);
        })
        .catch((e) => {
            res.status(502).send(e.message);
        });
    }
}

module.exports = Controller;

let HashBrown = require('./HashBrown');
