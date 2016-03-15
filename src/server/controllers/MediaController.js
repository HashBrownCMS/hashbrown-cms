'use strict';

let Controller = require('./Controller');
let MediaHelper = require('../helpers/MediaHelper');

class MediaController extends Controller {
    /**
     * Initiates this controller
     */
    static init(app) {
        app.get('/media/:id', MediaController.getMedia);
    }

    /**
     * Gets a Media object by id
     */
    static getMedia(req, res) {
        let id = req.params.id;

        MediaHelper.getMediaData(id)
        .then(function(data) {
            res.end(data, 'binary');
        });
    }
}

module.exports = MediaController;
