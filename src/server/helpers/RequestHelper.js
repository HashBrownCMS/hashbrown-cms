'use strict';

let restler = require('restler');

/**
 * A helper class for making HTTP requests
 */
class RequestHelper {
    /**
     * Makes a POST request
     *
     * @param {String} url
     * @param {Object} options
     *
     * @returns {Object} Signal object
     */
    static post(
        url = requiredParam('url'),
        options = requiredParam('options')
    ) {
        return restler.post(url, options);
    }
    
    /**
     * Makes a GET request
     *
     * @param {String} url
     * @param {Object} options
     *
     * @returns {Object} Signal object
     */
    static get(
        url = requiredParam('url'),
        options = requiredParam('options')
    ) {
        return restler.get(url, options);
    }
    
    /**
     * Makes a PUT request
     *
     * @param {String} url
     * @param {Object} options
     *
     * @returns {Object} Signal object
     */
    static put(
        url = requiredParam('url'),
        options = requiredParam('options')
    ) {
        return restler.put(url, options);
    }
    
    /**
     * Makes a PATCH request
     *
     * @param {String} url
     * @param {Object} options
     *
     * @returns {Object} Signal object
     */
    static patch(
        url = requiredParam('url'),
        options = requiredParam('options')
    ) {
        return restler.patch(url, options);
    }
    
    /**
     * Makes a DELETE request
     *
     * @param {String} url
     * @param {Object} options
     *
     * @returns {Object} Signal object
     */
    static del(
        url = requiredParam('url'),
        options = requiredParam('options')
    ) {
        return restler.del(url, options);
    }
}

module.exports = RequestHelper;
