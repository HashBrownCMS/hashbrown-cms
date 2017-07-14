'use strict';

// NOTE: a temporary fix for webpack
window._crypto = null;

// Style
require('../sass/client');

// ------------------
// Namespaces
// ------------------
window.HashBrown = {};

// Views
HashBrown.Views = {};

import * as Navigation from './Views/Navigation';
HashBrown.Views.Navigation = Navigation;

import * as Modals from './Views/Modals';
HashBrown.Views.Modals = Modals;

import * as Editors from './Views/Editors';
HashBrown.Views.Editors = Editors;

import * as FieldEditors from './Views/Editors/FieldEditors';
HashBrown.Views.Editors.FieldEditors = FieldEditors;

// Helpers
import * as Helpers from './Helpers';
HashBrown.Helpers = Helpers;

// Models
import * as Models from './Models';
HashBrown.Models = Models;

// Resource cache
window.resources = {
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

// Get routes
require('./Routes');

// Preload resources 
$(document).ready(() => {
    SettingsHelper.getSettings(ProjectHelper.currentProject, null, 'sync')
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
