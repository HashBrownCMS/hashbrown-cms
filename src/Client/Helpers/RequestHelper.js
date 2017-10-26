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

    /**
     * Reloads a resource
     */
    static reloadResource(name) {
        return RequestHelper.request('get', name)
        .then((result) => {
            window.resources[name] = result;

            // Apply correct model
            for(let i in window.resources[name]) {
                let object = window.resources[name][i];
                let model = null;

                switch(name) {
                    case 'connections':
                        model = new HashBrown.Models.Connection(object);
                        break;

                    case 'content':
                        model = new HashBrown.Models.Content(object);
                        break;

                    case 'templates':
                        model = new HashBrown.Models.Template(object);
                        break;
                    
                    case 'forms':
                        model = new HashBrown.Models.Form(object);
                        break;

                    case 'users':
                        model = new HashBrown.Models.User(object);
                        break;

                    case 'media':
                        model = new HashBrown.Models.Media(object);
                        break;

                    case 'schemas':
                        model = HashBrown.Helpers.SchemaHelper.getModel(object);
                        break;

                    default:
                        return Promise.reject(new Error('Resource "' + name + '" has no model defined'));
                }
                
                window.resources[name][i] = model;
            }

            return Promise.resolve(result);
        })
        .catch((e) => {
            // If the error is a 404, it's an intended response from the controller
            if(e.statusCode !== 404) {
                UI.errorModal(e);
            }

            return Promise.resolve([]);
        });
    };

    /**
     * Reloads all resources
     */
    static reloadAllResources() {
        $('.page--environment__spinner__messages').empty();
        
        let queue = [
            'content',
            'schemas',
            'media',
            'connections',
            'templates',
            'forms',
            'users'
        ];

        for(let item of queue) {
            let $msg = _.div({class: 'widget--spinner__message', 'data-name': item}, item);
            
            $('.page--environment__spinner__messages').append($msg);
        }

        let processQueue = () => {
            let name = queue.shift();

            return RequestHelper.reloadResource(name)
            .then(() => {
                $('.page--environment__spinner__messages [data-name="' + name + '"]').toggleClass('loaded', true);
                
                if(queue.length < 1) {
                    return Promise.resolve();

                } else {
                    return processQueue();

                }
            });
        }

        return processQueue();
    };

}

module.exports = RequestHelper;
