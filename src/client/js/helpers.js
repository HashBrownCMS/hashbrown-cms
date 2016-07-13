// Resource cache
window.resources = {
    editors: {},
    connections: {},
    connectionEditors: {},
    content: [],
    schemas: [],
    media: [],
    templates: [],
    sectionTemplates: []
};

// Libraries
require('exomon');
window.Promise = require('bluebird');

// Main views
window.MessageModal = require('./views/MessageModal');
window.NavbarMain = require('./views/NavbarMain');
window.MediaViewer = require('./views/MediaViewer');
window.LanguagePicker = require('./views/LanguagePicker');

// Editor views
require('./views/editors');
window.JSONEditor = require('./views/JSONEditor');
window.ContentEditor = require('./views/ContentEditor');
window.ConnectionEditor = require('./views/ConnectionEditor');
window.SchemaEditor = require('./views/SchemaEditor');
window.LanguageSettings = require('./views/LanguageSettings');

// Models
window.Content = require('./models/Content');

// Helpers
window.ProjectHelper = require('./helpers/ProjectHelper');
window.MediaHelper = require('./helpers/MediaHelper');
window.ConnectionHelper = require('./helpers/ConnectionHelper');
window.ContentHelper = require('./helpers/ContentHelper');
window.LanguageHelper = require('./helpers/LanguageHelper');
window.SchemaHelper = require('./helpers/SchemaHelper');
window.SettingsHelper = require('./helpers/SettingsHelper');

window.debug = require('../../common/helpers/DebugHelper');
window.debug.verbosity = 3;

let onReadyCallbacks = {};
let isReady = {};

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
 * @param {String} message
 */
window.errorModal = function errorModal(message) {
    messageModal('Error', message);
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
    let newUrl = 
        '/api/' + 
        ProjectHelper.currentProject + '/' +
        ProjectHelper.currentEnvironment + '/' + 
        url + 
        '?token=' + localStorage.getItem('token');

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
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open(method.toUpperCase(), apiUrl(url));
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
            
            if (xhr.readyState === DONE) {
                if(xhr.status == OK || xhr.status == NOT_MODIFIED) {
                    let response = xhr.responseText;

                    if(response && response != 'OK') {
                        try {
                            response = JSON.parse(response);
                        
                        } catch(e) {
                            debug.log('Response: ' + response, this)
                            debug.warning(e, this)

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
 * Reloads a resource
 */
window.reloadResource = function reloadResource(name) {
    return new Promise(function(callback) {
        $.ajax({
            type: 'GET',
            url: apiUrl(name),
            success: function(result) {
                window.resources[name] = result;

                callback(result);
            },
            error: function(e) {
                if(e.status == 403) {
                    location = '/login/?path=' + location.pathname + location.hash;
                }
                
                callback(null);
            }
        });
    });
};

/**
 * Reloads all resources
 */
window.reloadAllResources = function reloadAllResources() {
    return new Promise(function(resolve) {
        let queue = [
            'content',
            'schemas',
            'media',
            'connections',
            'templates',
            'sectionTemplates'
        ];

        function processQueue(name) {
            window.reloadResource(name)
            .then(function() {
                queue.pop();

                if(queue.length < 1) {
                    resolve();
                }
            });
        }

        for(let name of queue) {
            processQueue(name);
        }
    });
};

/**
 * Adds a ready callback to the queue or executes it if given key is already triggered
 */
window.onReady = function onReady(name, callback) {
    if(isReady[name]) {
        callback();
    
    } else {
        if(!onReadyCallbacks[name]) {
            onReadyCallbacks[name] = [];
        }

        onReadyCallbacks[name].push(callback);
    
    }
}

/**
 * Triggers a key
 */
window.triggerReady = function triggerReady(name) {
    isReady[name] = true;

    if(onReadyCallbacks[name]) {
        for(let callback of onReadyCallbacks[name]) {
            callback();
        }
    }
}
