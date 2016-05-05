'use strict';

// Promise
let Promise = require('bluebird');

class ContentHelper {
    /**
     * Gets all Content objects
     * This method must be overridden by a plugin
     *
     * @return {Promise} promise
     */
    static getAllContents() {
        return new Promise(function(callback) {
            callback([]);   
        });
    }

    /**
     * Gets a Content object by id
     * This method must be overridden by a plugin
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static getContentById(id) {
        return new Promise(function(callback) {
            callback({});   
        });
    }
    
    /**
     * Sets a Content object by id
     * This method must be overridden by a plugin
     *
     * @param {Number} id
     * @param {Object} content
     *
     * @return {Promise} promise
     */
    static setContentById(id, content) {
        content.updateDate = Date.now();

        return new Promise(function(callback) {
            callback();   
        });
    }
    
    /**
     * Removes a Content object by id
     * This method must be overridden by a plugin
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static removeContentById(id) {
        return new Promise(function(callback) {
            callback();   
        });
    }

    /**
     * Creates a new content
     * This method must be overridden by a plugin
     *
     * @return {Promise} promise
     */
    static createContent() {
        let content = Content.create();

        return new Promise(function(callback) {
            callback(content.data);   
        });
    }
}

module.exports = ContentHelper;
