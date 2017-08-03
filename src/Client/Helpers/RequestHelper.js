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
     * An environment-independent request
     *
     * @param {String} method
     * @param {String} url
     * @param {Object} data
     *
     * @returns {Promise} Response
     */
    static customRequest(method, url, data) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open(method.toUpperCase(), url);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

            if(data) {
                if(typeof data === 'object') {
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

                        error.xhr = xhr;

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
        let model = null;

        switch(name) {
            case 'connections':
                model = HashBrown.Models.Connection;
                break;

            case 'templates':
                model = HashBrown.Models.Template;
                break;

            case 'users':
                model = HashBrown.Models.User;
                break;

            case 'media':
                model = HashBrown.Models.Media;
                break;
        }

        return RequestHelper.request('get', name)
        .then((result) => {
            window.resources[name] = result;

            // If a model is specified, use it to initialise every resource
            if(model) {
                for(let i in window.resources[name]) {
                    window.resources[name][i] = new model(window.resources[name][i]);
                }
            }

            return Promise.resolve(result);
        })
        .catch((e) => {
            // If the error is a 404, it's an intended response from the controller
            if(e.xhr.status !== 404) {
                UI.errorModal(e);
            }

            return Promise.resolve([]);
        });
    };

    /**
     * Reloads all resources
     */
    static reloadAllResources() {
        $('.loading-messages').empty();
        
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
            let $msg = _.div({class: 'loading-message', 'data-name': item}, item);
            
            $('.loading-messages').append($msg);
        }

        let processQueue = () => {
            let name = queue.shift();

            return RequestHelper.reloadResource(name)
            .then(() => {
                $('.loading-messages [data-name="' + name + '"]').toggleClass('loaded', true);
                
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
