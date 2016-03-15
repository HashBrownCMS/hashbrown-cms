'use strict';

let MediaHelper = require('../helpers/MediaHelper');

let Content = require('./Content');

/**
 * The base class for all Media objects
 */
class Media extends Content {
    /**
     * Creates a new Media object
     *
     * @param {Object} file
     *
     * @return {Media} media
     */
    static create(file) {
        let content = Content.create({});

        let media = new Media(content.data);
    
        media.uploadPromise = MediaHelper.setMediaData(media.data.id, file);

        return media;
    }
}

module.exports = Media;
