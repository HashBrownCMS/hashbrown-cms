'use strict';

// Resource cache
window.resources = {
    editors: {},
    connections: {},
    connectionEditors: {},
    content: [],
    schemas: [],
    media: [],
    templates: [],
    sectionTemplates: [],
    forms: [],
    users: []
};

// Helper functions
require('./helpers');

// Main views
window.MainMenu = require('./views/MainMenu');
window.NavbarMain = require('./views/navbar/NavbarMain');
window.MediaViewer = require('./views/MediaViewer');

// Editor views
require('./views/editors');
window.JSONEditor = require('./views/JSONEditor');
window.InfoSettings = require('./views/InfoSettings');
window.ContentEditor = require('./views/ContentEditor');
window.FormEditor = require('./views/FormEditor');
window.ConnectionEditor = require('./views/ConnectionEditor');
window.SchemaEditor = require('./views/SchemaEditor');
window.LanguageSettings = require('./views/LanguageSettings');
window.SyncSettings = require('./views/SyncSettings');
window.UserEditor = require('./views/UserEditor');
window.MediaBrowser = require('./views/MediaBrowser');

// Models
window.Content = require('./models/Content');

// Helpers
window.MediaHelper = require('./helpers/MediaHelper');
window.ConnectionHelper = require('./helpers/ConnectionHelper');
window.ContentHelper = require('./helpers/ContentHelper');
window.LanguageHelper = require('./helpers/LanguageHelper');
window.SchemaHelper = require('./helpers/SchemaHelper');
window.SettingsHelper = require('./helpers/SettingsHelper');

// Ready callback containers
let onReadyCallbacks = {};
let isReady = {};

/**
 * Clears the workspace
 */
window.clearWorkspace = function clearWorkspace() {
    $('.workspace > div').remove();
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
    $('.loading-messages').empty();
    
    return new Promise(function(resolve) {
        let queue = [
            'content',
            'schemas',
            'media',
            'connections',
            'templates',
            'sectionTemplates',
            'forms',
            'users'
        ];

        function processQueue(name) {
            let $msg = _.div({'data-name': name}, 'Loading ' + name + '...');

            $('.loading-messages').append($msg);

            window.reloadResource(name)
            .then(function() {
                $msg.append(' OK');
                
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
 * Resets a key
 */
window.resetReady = function resetReady(name) {
    delete isReady[name];
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

// Get package file
window.app = require('../../../package.json');

// Preload resources 
$(document).ready(() => {
    reloadAllResources()
    .then(function() {
        triggerReady('resources');
    });
});

// Language
window.language = localStorage.getItem('language') || 'en';

// Get routes
require('./routes/index');

// Init
onReady('resources', function() {
    new NavbarMain();
    new MainMenu();

    Router.init();
});
