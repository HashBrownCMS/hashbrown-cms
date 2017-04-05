// Libraries
require('exomon');
window.Promise = require('bluebird');
window.marked = require('marked');
window.toMarkdown = require('to-markdown');

// Common views
window.MessageModal = require('./views/MessageModal');

// Common helpers
window.UI = require('./helpers/UIHelper');
window.ProjectHelper = require('./helpers/ProjectHelper');
window.LanguageHelper = require('./helpers/LanguageHelper');
window.SettingsHelper = require('./helpers/SettingsHelper');

window.debug = require('../../common/helpers/DebugHelper');
window.debug.verbosity = 3;

/**
 * Checks if the currently logged in user is admin
 *
 * @resurns {Boolean} Is admin
 */
window.isCurrentUserAdmin = function isCurrentUserAdmin() {
    for(let user of resources.users) {
        if(user.isCurrent) {
            return user.isAdmin;
        }
    }

    return false;
}

/**
 * Checks if the currently logged in user has a particular scope
 *
 * @param {String} scope
 *
 * @resurns {Boolean} Has scope
 */
window.currentUserHasScope = function currentUserHasScope(scope) {
    for(let user of resources.users) {
        if(user.isCurrent) {
            return user.hasScope(scope);
        }
    }

    return false;
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
