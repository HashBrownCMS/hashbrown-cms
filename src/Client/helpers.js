window.Promise = require('bluebird');
window.marked = require('marked');
window.toMarkdown = require('to-markdown');

const ProjectHelper = require('Client/Helpers/ProjectHelper');
const User = require('Common/Models/User');

/**
 * Checks if the currently logged in user is admin
 *
 * @returns {Boolean} Is admin
 */
window.currentUserIsAdmin = function isCurrentUserAdmin() {
    return User.current.isAdmin;
}

/**
 * Checks if the currently logged in user has a certain scope
 *
 * @param {String} scope
 *
 * @returns {Boolean} Has scope
 */
window.currentUserHasScope = function currentUsr(scope) {
    return User.current.hasScope(ProjectHelper.currentProject, scope);
}

/**
 * Handles a required parameter
 */
window.requiredParam = function requiredParam(name) {
    throw new Error('Parameter "' + name + '" is required');
}

/**
 * Gets a cookie by name
 *
 * @param {String} name
 *
 * @returns {String} value
 */
window.getCookie = function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");

    if(parts.length == 2) {
        return parts.pop().split(";").shift();
    }
}

/**
 * Copies string to the clipboard
 *
 * @param {String} string
 */
window.copyToClipboard = function copyToClipboard(string) {
    let text = document.createElement('TEXTAREA');

    text.innerHTML = string;

    document.body.appendChild(text);

    text.select();

    try {
        let success = document.execCommand('copy');

        if(!success) {
            UI.errorModal('Your browser does not yet support copying to clipboard');
        }
    } catch(e) {
            UI.errorModal(e.toString());
    }

    document.body.removeChild(text);
}

/**
 * Wraps an API URL
 *
 * @param {String} url
 *
 * @returns {String} API URL
 */
window.apiUrl = function apiUrl(url) {
    let newUrl = '/api/';

    if(ProjectHelper.currentProject) {
        newUrl += ProjectHelper.currentProject + '/';
    }
        
    if(ProjectHelper.currentEnvironment) {
        newUrl += ProjectHelper.currentEnvironment + '/';
    }

    newUrl += url;
  
    return newUrl;
};

/**
 * Wraps an API call
 *
 * @param {String} method
 * @param {String} url
 * @param {Object} data
 *
 * @returns {Promise} Response
 */
window.apiCall = function apiCall(method, url, data) {
    return customApiCall(method, apiUrl(url), data);
}
    
/**
 * Wraps an API call with a custom path
 *
 * @param {String} method
 * @param {String} url
 * @param {Object} data
 *
 * @returns {Promise} Response
 */
window.customApiCall = function customApiCall(method, url, data) {
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
            let DONE = 4;
            let OK = 200;
            let NOT_MODIFIED = 304;
            let UNAUTHORIZED = 403;

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
                    reject(new Error(xhr.responseText));
                
                }
            }
        }
    });
};

/**
 * Listens for server restart
 */
window.listenForRestart = function listenForRestart() {
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
 * Clears the workspace
 */
window.clearWorkspace = function clearWorkspace() {
    $('.workspace').empty();
};

/**
 * Sets workspace content
 */
window.populateWorkspace = function populateWorkspace($html, classes) {
    let $workspace = $('.workspace');

    $workspace.empty();
    $workspace.attr('class', 'workspace');
    
    _.append($workspace, $html);

    if(classes) {
        $workspace.addClass(classes);
    }
};

/**
 * Reloads a resource
 */
window.reloadResource = function reloadResource(name) {
    let model = null;

    switch(name) {
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

    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: apiUrl(name),
            success: function(result) {
                window.resources[name] = result;

                // If a model is specified, use it to initialise every resource
                if(model) {
                    for(let i in window.resources[name]) {
                        window.resources[name][i] = new model(window.resources[name][i]);
                    }
                }

                resolve(result);
            },
            error: function(e) {
                window.resources[name] = [];
                
                if(e.status == 403) {
                    location = '/login/?path=' + location.pathname + location.hash;
                
                } else if(e.status == 404) {
                    resolve([]);

                } else {
                    resolve([]);
                    
                    UI.errorModal(new Error(e.responseText));
                
                }
            }
        });
    });
};

/**
 * Reloads all resources
 */
window.reloadAllResources = function reloadAllResources() {
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

    function processQueue() {
        let name = queue.shift();

        return window.reloadResource(name)
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

/**
 * Start the debug socket
 */
window.startDebugSocket = function startDebugSocket() {
    let debugSocket = new WebSocket('ws://' + location.host + '/api/debug');

    debugSocket.onopen = (ev) => {
        debug.log('Debug socket open', 'HashBrown');
    };

    debugSocket.onmessage = (ev) => {
        try {
            let data = JSON.parse(ev.data);

            switch(data.type) {
                case 'error':
                    UI.errorModal(new Error(data.sender + ': ' + data.message));
                    break;

                case 'warning':
                    UI.errorModal(new Error(data.sender + ': ' + data.message));
                    break;
            }

        } catch(e) {
            UI.errorModal(e);
        }
    };
};

// Start debug socket
startDebugSocket();

// Get package file
window.app = require('package.json');

// Language
window.language = localStorage.getItem('language') || 'en';
