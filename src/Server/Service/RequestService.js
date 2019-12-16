'use strict';

const HTTP = require('http');
const HTTPS = require('https');
const QueryString = require('querystring');
const FileSystem = require('fs');
const URL = require('url');
const Path = require('path');

const MAX_REDIRECTS = 10;

/**
 * A helper class for making HTTP requests
 *
 * @memberof HashBrown.Server.Service
 */
class RequestService {
    /**
     * Pipes the result of a get request into the original result object
     *
     * @param {String} url
     * @param {Object} res
     */
    static pipe(url, res) {
        checkParam(url, 'url', String);
        checkParam(res, 'res', Object);

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
     * Makes a paginated request
     *
     * @param {String} address
     * @param {Object} data
     * @param {Number} maxPages
     *
     * @returns {Promise} Response
     */
    static getPaginated(url, data = null, maxPages = 10) {
        checkParam(url, 'url', String);

        if(!data) {
            data = {};
        }

        data.page = 0;

        let combinedResult = [];

        let getNext = () => {
            return this.request('get', url, data)
            .then((result) => {
                if(!result || !Array.isArray(result) || result.length < 1) {
                    return Promise.resolve(combinedResult);
                }

                combinedResult = combinedResult.concat(result);

                data.page++;

                return getNext();
            });
        };

        return getNext();
    }

    /**
     * Makes a generic request
     *
     * @param {String} method
     * @param {String} url
     * @param {Object} data
     * @param {Boolean} asQueryString
     *
     * @returns {Promise} Response
     */
    static request(method, url, data = null, asQueryString = false) {
        checkParam(method, 'method', String);
        checkParam(url, 'url', String);

        return new Promise((resolve, reject) => {
            method = method.toUpperCase();

            let contentType = 'text/plain';

            if(method === 'GET') {
                asQueryString = true;
            }

            // Convert data
            if(data) {
                // To query string
                if(asQueryString) {
                    url += '?' + QueryString.stringify(data);
                    data = null;

                // To JSON string
                } else if(typeof data === 'object') {
                    data = JSON.stringify(data);
                    contentType = 'application/json';
                
                }
            }
          
            // Parse URL
            url = URL.parse(url);
            
            let headers = {
                'Accept': '*/*',
                'User-Agent': 'HashBrown CMS',
                'Content-Type': contentType + '; charset=utf-8',
                'Host': url.hostname
            };
            
            if(data) {
                headers['Content-Length'] = Buffer.byteLength(data);
            }

            // Makes the actual request and checks for redirects
            let redirects = 0;
            
            let makeRequest = () => {
                let protocol = url.protocol === 'https:' ? HTTPS : HTTP;
                
                let options = {
                    port: url.port,
                    host: url.hostname,
                    path: url.path,
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

                        // Host name not found, prepend old one
                        if(!newUrl.host) {
                            newUrl.host = url.host;
                        }
                       
                        url = newUrl;

                        redirects++;

                        makeRequest();
                    
                    // No redirect, we reached our destination
                    } else {
                        let str = '';
                 
                        res.on('data', (chunk) => {
                            str += chunk;
                        });

                        res.on('error', (err) => {
                            reject(err);
                        });

                        res.on('end', () => {
                            let result = str;
                           
                            try {
                                result = JSON.parse(str);

                            // If response isn't JSON, just return the string
                            } catch(e) {
                                
                            }
                           
                            // Error happened
                            if(res.statusCode >= 400 && res.statusCode < 600) {
                                let error = new Error(res.statusMessage + ' (' + res.statusCode + ')\nat ' + method + ' ' + url.protocol + '//' + Path.join(url.host, url.path));
                               
                                error.url = url;
                                error.statusCode = res.statusCode;

                                return reject(error);
                            }
                            
                            resolve(result, res);
                        });
                    }
                });
               
                // Handle errors
                req.on('error', (e) => {
                    e.url = url;

                    reject(e);
                });

                if(data) {
                    req.write(data);
                }

                req.end();  
            }

            makeRequest();
        });
    }
}

module.exports = RequestService;
