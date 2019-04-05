'use strict';

/**
 * A helper class for making HTTP/S requests
 *
 * @memberof HashBrown.Client.Helpers
 */
class RequestHelper {
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
        return RequestHelper.customRequest(method, RequestHelper.environmentUrl(url), data);
    }

    /**
     * Uploads a file
     *
     * @param {String} url
     * @param {String} type
     * @param {FormData} data
     *
     * @returns {Promise} Response
     */
    static uploadFile(url, type, data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: RequestHelper.environmentUrl(url),
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
        //return RequestHelper.customRequest('POST', RequestHelper.environmentUrl(url), data, { 'Content-Type': type });
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
        if(url.indexOf('/resources') > -1) {
            console.trace();
        }
        
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
                    if(xhr.status === UNAUTHORIZED) {
                        location = '/login/?path=' + location.pathname + location.hash;

                        reject(new Error('User is not logged in'));

                    } else if(xhr.status == OK || xhr.status == NOT_MODIFIED) {
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

                        error.statusCode = xhr.status;

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

        if(HashBrown.Helpers.ProjectHelper.currentProject) {
            newUrl += HashBrown.Helpers.ProjectHelper.currentProject + '/';
        }

        if(HashBrown.Helpers.ProjectHelper.currentEnvironment) {
            newUrl += HashBrown.Helpers.ProjectHelper.currentEnvironment + '/';
        }

        newUrl += url;

        return newUrl;
    }

    /**
     * Listens for server restart
     */
    static listenForRestart() {
        UI.messageModal('Restart', 'HashBrown is restarting...', false);

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

module.exports = RequestHelper;
