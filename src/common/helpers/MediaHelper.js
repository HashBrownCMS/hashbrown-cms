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
     * Gets the Media tree
     *
     * @returns {Promise(Object)} tree
     */
    static getTree() {
        return new Promise((resolve, reject) => {
            resolve({});
        });
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
        return new Promise((resolve, reject) => {
            resolve();
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
