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
     *
     * @returns {Promise} Response
     */
    static request(method, url, data) {
        return RequestService.customRequest(method, this.environmentUrl(url), data);
    }

    /**
     * Uploads a file
     *
     * @param {String} url
     * @param {FormData} data
     *
     * @returns {String|Object} Response
     */
    static async upload(url, data) {
        return await new Promise((resolve, reject) => {
            $.ajax({
                url: this.environmentUrl(url),
                type: 'POST',
                data: data,
                processData: false,
                contentType: false,
                success: (response) => {
                    resolve(response);
                },
                error: (e) => {
                    reject(e);            
                }
            })
        });
    }

    /**
     * An environment-independent request
     *
     * @param {String} method
     * @param {String} url
     * @param {Object} data
     * @param {Object} headers
     *
     * @returns {Promise} Response
     */
    static customRequest(method, url, data, headers) {
        headers = headers || {
            'Content-Type': 'application/json; charset=utf-8'
        };

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
     */
    static environmentUrl(url) {
        let newUrl = '/api/';

        if(HashBrown.Context.projectId) {
            newUrl += HashBrown.Context.projectId + '/';
        }

        if(HashBrown.Context.environment) {
            newUrl += HashBrown.Context.environment + '/';
        }

        newUrl += url;

        return newUrl;
    }

    /**
     * Listens for server restart
     */
    static listenForRestart() {
        UI.notify('Restart', 'HashBrown is restarting...', false);

        function poke() {
            $.ajax({
                type: 'get',
                url: '/',
                success: () => {
                    location.reload();
                },
                error: () => {
                    poke();
                }
            });
        }

        poke();
    };
}

module.exports = RequestService;
