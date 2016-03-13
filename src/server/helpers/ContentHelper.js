'use strict';

// Promise
let Promise = require('bluebird');

class ContentHelper {
    /**
     * Gets all Section objects
     * This method must be overridden by a plugin
     *
     * @return {Promise} promise
     */
    static getAllSections() {
        return new Promise(function(callback) {
            callback([]);   
        });
    }
    
    /**
     * Gets all Page objects
     * This method must be overridden by a plugin
     *
     * @return {Promise} promise
     */
    static getAllPages() {
        return new Promise(function(callback) {
            callback([]);   
        });
    }

    /**
     * Gets a Page object by id
     * This method must be overridden by a plugin
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static getPageById(id) {
        return new Promise(function(callback) {
            callback({});   
        });
    }
    
    /**
     * Sets a Page object by id
     * This method must be overridden by a plugin
     *
     * @param {Number} id
     * @param {Object} page
     *
     * @return {Promise} promise
     */
    static setPageById(id, page) {
        page.updateDate = Date.now();

        return new Promise(function(callback) {
            callback();   
        });
    }

    /**
     * Creates a new page
     * This method must be overridden by a plugin
     *
     * @return {Promise} promise
     */
    static createPage() {
        let page = Page.create();

        return new Promise(function(callback) {
            callback(page.data);   
        });
    }
}

module.exports = ContentHelper;
