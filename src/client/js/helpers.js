// Libraries
require('exomon');
window.Promise = require('bluebird');

// Common views
window.MessageModal = require('./views/MessageModal');

// Common helpers
window.ProjectHelper = require('./helpers/ProjectHelper');

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
 * Brings up a message modal
 *
 * @param {String} title
 * @param {String} body
 */
window.messageModal = function messageModal(title, body, onSubmit) {
    return new MessageModal({
        model: {
            title: title,
            body: body,
            onSubmit: onSubmit
        }
    });
}

/**
 * Brings up an error modal
 *
 * @param {String|Error} error
 */
window.errorModal = function errorModal(error) {
    if(error instanceof String) {
        error = new Error(error);
    
    } else if (error && error instanceof Object) {
        if(error.responseText) {
            error = new Error(error.responseText);
        }
    }

    let modal = messageModal('<span class="fa fa-warning"></span> Error', error.message);

    modal.$element.toggleClass('error-modal', true);

    throw error;
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
 * Logs out the current user
 */
window.logout = function logout() {
    document.cookie = 'token=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    location.reload();
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
            errorModal('Your browser does not yet support copying to clipboard');
        }
    } catch(e) {
            errorModal(e.toString());
    }

    document.body.removeChild(text);
}

/**
 * Wraps an API URL
 *
 * @param {String} url
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
 *
 * @returns {Promise(Object)} response
 */
window.apiCall = function apiCall(method, url, data) {
    return customApiCall(method, apiUrl(url), data);
}
    
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
