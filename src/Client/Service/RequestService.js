'use strict';

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
     * An environment-independent request
     *
     * @param {String} method
     * @param {String} url
     * @param {Object} data
     * @param {Object} headers
     *
     * @returns {Object} Response
     */
    static customRequest(method, url, data, headers) {
        headers = headers || {
            'Content-Type': 'application/json; charset=utf-8'
        };

        url = (HashBrown.Context.rootUrl || '') + url;
        
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open(method.toUpperCase(), url);

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

        if(HashBrown.Context.project) {
            newUrl += HashBrown.Context.project.id + '/';
        }

        if(HashBrown.Context.environment) {
            newUrl += HashBrown.Context.environment + '/';
        }

        newUrl += url;

        if(query && Object.keys(query).length > 0) {
            newUrl += '?' + new URLSearchParams(query).toString();
        }

        return newUrl;
    }
}

module.exports = RequestService;
