'use strict';

const MAX_CACHE_TIME = 1000 * 60 * 5; // 5 minutes

/**
 * A helper class for making HTTP/S requests
 *
 * @memberof HashBrown.Client.Service
 */
class RequestService {
    /**
     * An environment specific request
     *
     * @param {String} method
     * @param {String} url
     * @param {Object} data
     * @param {Object} query
     *
     * @returns {*} Response
     */
    static async request(method, url, data, query) {
        return await this.customRequest(method, this.environmentUrl(url, query), data);
    }

    /**
     * An environment independent request
     *
     * @param {String} method
     * @param {String} url
     * @param {Object} data
     * @param {Object} headers
     *
     * @returns {Object} Response
     */
    static async customRequest(method, url, data, headers) {
        method = method.toUpperCase();
        url = (HashBrown.Client.rootUrl || '') + url;
        headers = headers || {
            'Content-Type': 'application/json; charset=utf-8'
        };
       
        // Initialise request cache
        this.cache = this.cache || {};

        // Any non-GET request clears the cache
        if(method !== 'GET') {
            this.cache = {};

        // Look up a request in the cache
        } else if(this.cache[url]) {
            if(this.cache[url].expires > Date.now()) {
                return await Promise.race([ this.cache[url].promise ]);
            }
        
            delete this.cache[url];
        } 
        
        // Create a new request
        let promise = new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);

            for(let k in headers) {
                xhr.setRequestHeader(k, headers[k]);
            }

            if(data) {
                if(typeof data === 'object' && data instanceof FormData === false) {
                    data = JSON.stringify(data);
                }
               
                xhr.send(data);

            } else {
                xhr.send();
            
            }

            xhr.onreadystatechange = () => {
                const DONE = 4;
                const OK = 200;
                const NOT_MODIFIED = 304;
                const UNAUTHORIZED = 403;

                if(xhr.readyState === DONE) {
                    if(xhr.status == OK || xhr.status == NOT_MODIFIED) {
                        let response = xhr.responseText;

                        if(response && response != 'OK') {
                            try {
                                response = JSON.parse(response);
                            
                            } catch(e) {
                                // If the response isn't JSON, then so be it

                            }
                        }

                        if(response === '') { response = null; }

                        resolve(response);

                    } else {
                        let error = new Error(xhr.responseText);

                        error.code = xhr.status;

                        reject(error);
                    
                    }
                }
            }
        });
        
        if(method === 'GET') {
            this.cache[url] = {
                promise: promise,
                expires: Date.now() + MAX_CACHE_TIME
            };
        }

        return await promise;
    }

    /**
     * Wraps a URL to include environment
     *
     * @param {String} url
     * @param {Object} query
     */
    static environmentUrl(url, query = {}) {
        checkParam(url, 'url', String, true);
        checkParam(query, 'query', Object);

        let newUrl = '/api/';

        if(HashBrown.Client.context.project) {
            newUrl += HashBrown.Client.context.project.id + '/';
        }

        if(HashBrown.Client.context.environment) {
            newUrl += HashBrown.Client.context.environment + '/';
        }

        newUrl += url;

        if(query && Object.keys(query).length > 0) {
            newUrl += '?' + new URLSearchParams(query).toString();
        }

        return newUrl;
    }
}

module.exports = RequestService;
