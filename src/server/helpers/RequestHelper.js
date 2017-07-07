'use strict';

const Restler = require('restler');
const HTTP = require('http');
const HTTPS = require('https');
const QueryString = require('querystring');
const FS = require('fs');
const URL = require('url');

const MAX_REDIRECTS = 5;

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
        url = url.replace('HTTP://', '');
        url = url.replace('HTTPS://', '');

        let hostname = url.split('/')[0];
        let path = url.replace(hostname, '');

        try {
            let externalReq = HTTP.request({
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
     * Downloads a file
     *
     * @param {String} url
     * @param {String} destination
     *
     * @returns {Promise} Result
     */
    static download(
        url = requiredParam('url'),
        destination = requiredParam('destination')
    ) {
        return new Promise((resolve, reject) => {
            let file = FS.createWriteStream(destination);   
            let request = HTTP.get(url, (response) => {
                response.pipe(file);

                file.on('finish', () => {
                    file.close(resolve);
                });
            });

            request.on('error', (e) => {
                FS.unlink(destination);

                reject(e);
            });
        });
    }

    /**
     * Makes a generic request
     *
     * @param {String} method
     * @param {String} address
     * @param {Object} data
     * @param {Boolean} asQueryString
     *
     * @returns {Promise} Response
     */
    static request(
        method = requiredParam('method'),
        url = requiredParam('url'),
        data = null,
        asQueryString = false
    ) {
        return new Promise((resolve, reject) => {
            method = method.toUpperCase();
            url = URL.parse(url);            

            // Convert data
            if(data) {
                // To query string
                if(asQueryString || method === 'GET') {
                    url += '?' + QueryString.stringify(data);
                    data = null;

                // To JSON string
                } else {
                    data = JSON.stringify(data);
                }
            }

            let headers = {
                'Accept': '*/*',
                'User-Agent': 'HashBrown CMS',
                'Host': url.hostname
            };
            
            // Makes the actual requesit and checks for redirects
            let redirects = 0;
            
            let makeRequest = () => {
                let protocol = url.protocol === 'https:' ? HTTPS : HTTP;

                let options = {
                    host: url.hostname,
                    path: url.pathname,
                    method: method,
                    headers: headers
                };

                let req = protocol.request(options, (res) => {
                    // We're being redirected
                    if(res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {
                        // Max amount of redirects detected
                        if(redirects >= MAX_REDIRECTS) {
                            return reject(new Error('Max amount of redirects exceeded'));
                        }

                        let newUrl = URL.parse(res.headers.location);

                        // Host name found
                        if(!newUrl.hostname) {
                            newUrl.hostname = url.hostname;
                        }
                       
                        url = newUrl;

                        redirects++;

                        makeRequest();

                    // No redirect, re reached out destination
                    } else {
                        let str = '';
                 
                        res.on('data', (chunk) => {
                            str += chunk;
                        });

                        res.on('error', (err) => {
                            reject(err);
                        });

                        res.on('end', () => {
                            let res = str;
                           
                            try {
                                res = JSON.parse(str);

                            // If response isn't JSON, just return the string
                            } catch(e) {
                                
                            }
                            
                            resolve(res);
                        });
                    }
                });
               
                if(data && method !== 'GET') {
                    req.write(data);
                }

                req.end();  
            }

            makeRequest();
        });
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
        return Restler.post(url, options);
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
        return Restler.get(url, options);
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
        return Restler.put(url, options);
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
        return Restler.patch(url, options);
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
        return Restler.del(url, options);
    }
}

module.exports = RequestHelper;
