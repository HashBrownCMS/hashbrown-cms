'use strict';

/**
 * A helper for Media objects
 *
 * @memberof HashBrown.Common.Service
 */
class MediaService {
    /**
     * Gets the media root path
     *
     * @returns {Promise} Path
     */
    static getRootPath() {
        return ConnectionService.getMediaProvider()
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
    static getTempPath(project) {
        checkParam(project, 'project', String);

        let path = 
            '/storage/' +
            ProjectService.currentProject +
            '/temp';

        return path;
    }
}

module.exports = MediaService;
