'use strict';

const HTTP = require('http');
const HTTPS = require('https');
const QueryString = require('querystring');
const FileSystem = require('fs');
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
            url = new URL(url);
            
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
                    path: url.pathname + url.search,
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

                        let newUrl = new URL(res.headers.location);

                        // Host name not found, prepend old one
                        if(!newUrl.hostname) {
                            newUrl.hostname = url.hostname;
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
                                return reject(new HashBrown.Http.Exception(
                                    res.statusMessage + ' (' + method + ' ' + url.toString() + ')',
                                    res.statusCode
                                ));
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
