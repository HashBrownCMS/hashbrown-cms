'use strict';

// Models
let Media = require('../models/Media');

class MediaHelper {
    /**
     * Gets the media root path
     *
     * @returns {Promise(String)} path
     */
    static getRootPath() {
        return new Promise((resolve, reject) => {
            ConnectionHelper.getMediaProvider()
            .then((connection) => {
                resolve(connection.getMediaPath());   
            })
            .catch(() => {
                resolve('');  
            });
        });
    }

    /**
     * Gets the media temp path
     *
     * @returns {String} path
     */
    static getTempPath() {
        let path = 
            '/storage/' +
            ProjectHelper.currentProject +
            '/temp';

        return path;
    }
}

module.exports = MediaHelper;
