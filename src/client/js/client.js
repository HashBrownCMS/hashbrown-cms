'use strict';

// NOTE: a temporary fix for webpack
window._crypto = null;

// Style
require('../sass/client');

// Resource cache
window.resources = {
    editors: {},
    connections: {},
    connectionEditors: {},
    content: [],
    schemas: [],
    media: [],
    templates: [],
    forms: [],
    users: []
};

// Helper functions
require('./helpers');

// Main views
window.MainMenu = require('./views/MainMenu');
window.NavbarPane = require('./views/navbar/Pane');
window.NavbarMain = require('./views/navbar/NavbarMain');
window.MediaViewer = require('./views/MediaViewer');
window.MediaBrowser = require('./views/MediaBrowser');

// Field editors
require('./views/fields');

// Editor views
window.JSONEditor = require('./views/JSONEditor');
window.TemplateEditor = require('./views/TemplateEditor');
window.ContentEditor = require('./views/ContentEditor');
window.FormEditor = require('./views/FormEditor');
window.ConnectionEditor = require('./views/ConnectionEditor');
window.SchemaEditor = require('./views/SchemaEditor');
window.SyncSettings = require('./views/SyncSettings');
window.ProvidersSettings = require('./views/ProvidersSettings');
window.UserEditor = require('./views/UserEditor');

// Models
window.Content = require('./models/Content');
window.Schema = require('../../common/models/Schema');
window.Media = require('../../common/models/Media');
window.User = require('../../common/models/User');
window.Template = require('../../common/models/Template');

// Helpers
window.MediaHelper = require('./helpers/MediaHelper');
window.ConnectionHelper = require('./helpers/ConnectionHelper');
window.ContentHelper = require('./helpers/ContentHelper');
window.SchemaHelper = require('./helpers/SchemaHelper');
window.UI = require('./helpers/UIHelper');

// Ready callback containers
let onReadyCallbacks = {};
let isReady = {};

// ----------
// Global methods
// ----------
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
            model = Template;
            break;

        case 'users':
            model = User;
            break;

        case 'media':
            model = Media;
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

// Language
window.language = localStorage.getItem('language') || 'en';

// Get routes
require('./routes/index');

// Preload resources 
$(document).ready(() => {
    SettingsHelper.getSettings(ProjectHelper.currentProject, ProjectHelper.currentEnvironment, 'sync')
    .then(() => {
        return LanguageHelper.getSelectedLanguages(ProjectHelper.currentProject);
    })
    .then(() => {
        return reloadAllResources();
    })
    .then(() => {
        for(let user of resources.users) {
            if(user.isCurrent) {
                User.current = user;
            }
        }
        
        new NavbarMain();
        new MainMenu();

        Router.check = (newRoute, cancel, proceed) => {
            let contentEditor = ViewHelper.get('ContentEditor');

            if(
                (!contentEditor || !contentEditor.model) ||
                (newRoute.indexOf(contentEditor.model.id) > -1) ||
                (!contentEditor.dirty)
            ) {
                proceed();
                return;
            }

            UI.confirmModal(
                'Discard',
                'Discard unsaved changes?',
                'You have made changes to "' + (contentEditor.model.prop('title', window.language) || contentEditor.model.id) + '"',
                () => {
                    contentEditor.dirty = false;
                    proceed();
                },
                cancel
            );
        };


        $('.cms-container').removeClass('faded');

        Router.init();
    })
    .catch((e) => {
        UI.errorModal(e);
    });
});
