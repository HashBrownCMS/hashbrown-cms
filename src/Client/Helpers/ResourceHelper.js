'use strict';

/**
 * A helper class for accessing resources on the server and in cache
 *
 * @memberof HashBrown.Client.Helpers
 */
class ResourceHelper {
    /**
     * Connects to the WebSQL database
     *
     * @returns {Database}

    /**
     * Makes a WebSQL SELECT query
     *
     * @param {String} table
     *
     * @return {Array} Result
     */
    static select(table) {
        checkParam(table, 'table', String);

        let db = openData
    }
    
    /**
     * Gets a list of resources
     *
     * @param {String} category
     * @param {Boolean} noCache
     *
     * @returns {Array} Resources
     */
    
    
}

module.exports = ResourceHelper;
