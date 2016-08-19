'use strict';

let HashBrown = require('./HashBrown');

let config = require('./config.json');

class Controller {
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
