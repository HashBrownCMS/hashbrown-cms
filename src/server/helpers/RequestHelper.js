'use strict';

let restler = require('restler');
let http = require('http');

/**
 * A helper class for making HTTP requests
 */
class RequestHelper {
    /**
     * Pipes the result of a get request into the original result object
     *
     * @param {String} url
     * @param {Object} res
     */
    static pipe(
        url = requiredParam('url'),
        res = requiredParam('res')
    ) {
        url = url.replace('http://', '');
        url = url.replace('https://', '');

        let hostname = url.split('/')[0];
        let path = url.replace(hostname, '');

        try {
            let externalReq = http.request({
                hostname: hostname,
                path: path
            }, (externalRes) => {
                externalRes.pipe(res);
            });

            externalReq.end();

        } catch(e) {
            res.status(404).send(e.message);

        }
    }

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
