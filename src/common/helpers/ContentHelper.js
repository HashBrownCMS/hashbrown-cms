'use strict';

class ContentHelper {
    /**
     * Gets all Content objects
     *
     * @return {Promise} promise
     */
    static getAllContents() {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    /**
     * Gets a Content object by id
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static getContentById(id) {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    
    /**
     * Sets a Content object by id
     *
     * @param {Number} id
     * @param {Object} content
     *
     * @return {Promise} promise
     */
    static setContentById(id, content) {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    /**
     * Creates a new content object
     *
     * @return {Promise} promise
     */
    static createContent() {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    
    /**
     * Removes a content object
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static removeContentById(id) {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
}

module.exports = ContentHelper;
