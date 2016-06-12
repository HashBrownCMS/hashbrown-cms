'use strict';

let Controller = require('./Controller');

class MediaController extends Controller {
    /**
     * Initiates this controller
     */
    static init(app) {
        app.get('/:project/:environment/media/:id', MediaController.getMedia);
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
