'use strict';

// Models
let Media = require('../models/Media');

class MediaHelper {
    /**
     * Gets the media root path
     *
     * @returns {Promise} Path
     */
    static getRootPath() {
        return ConnectionHelper.getMediaProvider()
        .then((connection) => {
            resolve(connection.getMediaPath());   
        })
        .catch(() => {
            resolve('');  
        });
    }

    /**
     * Gets the Media tree
     *
     * @returns {Promise(Object)} tree
     */
    static getTree() {
        return Promise.resolve({});
    }
    
    /**
     * Sets a Media tree item
     *
     * @param {String} id
     * @param {Object} item
     *
     * @returns {Promise} promise
     */
    static setTreeItem(id, item) {
        return Promise.resolve();
    }

    /**
     * Gets the media temp path
     *
     * @param {String} project
     *
     * @returns {String} Path
     */
    static getTempPath(
        project = requiredParam('project')
    ) {
        let path = 
            '/storage/' +
            ProjectHelper.currentProject +
            '/temp';

        return path;
    }
}

module.exports = MediaHelper;
