'use strict';

// MongoDB client
let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;

// Config
let config = require('../../../config.json');

class ContentHelper {
    /**
     * Gets a Page object by id
     *
     * @param {Number} id
     */
    static getPageById(id) {
        return {};
    }
    
    /**
     * Sets a Page object by id
     *
     * @param {Number} id
     * @param {Object} page
     *
     * @return {Bool} Success
     */
    static setPageById(id, page) {
        return true;
    }
}

module.exports = ContentHelper;
