// Libraries
require('exomon');
window.Promise = require('bluebird');

// Views
window.MessageModal = require('./views/MessageModal');
window.NavbarMain = require('./views/NavbarMain');
window.JSONEditor = require('./views/JSONEditor');
window.ContentEditor = require('./views/ContentEditor');
window.ConnectionEditor = require('./views/ConnectionEditor');
window.SchemaEditor = require('./views/SchemaEditor');
window.MediaViewer = require('./views/MediaViewer');
window.LanguagePicker = require('./views/LanguagePicker');
window.LanguageSettings = require('./views/LanguageSettings');

// Models
window.Content = require('./models/Content');

// Helpers
//window.ConnectionHelper = require('./helpers/ConnectionHelper');
//window.MediaHelper = require('./helpers/MediaHelper');
window.ContentHelper = require('./helpers/ContentHelper');
window.LanguageHelper = require('./helpers/LanguageHelper');
window.ProjectHelper = require('./helpers/ProjectHelper');
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
 * Wraps an API call
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
            }
        });
    });
};

/**
 * Reloads all resources
 */
window.reloadAllResources = function reloadAllResources() {
    return new Promise(function(callback) {
        let queue = ['content', 'schemas', 'media', 'connections'];

        function processQueue(name) {
            window.reloadResource(name)
            .then(function() {
                queue.pop();

                if(queue.length < 1) {
                    callback();
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
