'use strict';

/**
 * @namespace HashBrown.Client
 */

// Style
require('Client/Style/client');

// Get routes
require('Client/Routes');

// Resource cache
window.resources = {
    connections: [],
    content: [],
    schemas: [],
    media: [],
    templates: [],
    forms: [],
    users: []
};

// Namespaces
window._ = Crisp.Elements;

window.HashBrown = {};

HashBrown.Models = require('Client/Models');
HashBrown.Views = {};
HashBrown.Views.Widgets = require('Client/Views/Widgets');
HashBrown.Views.Modals = require('Client/Views/Modals');
HashBrown.Views.Navigation = require('Client/Views/Navigation');
HashBrown.Views.Editors = require('Client/Views/Editors');
HashBrown.Views.Editors.ConnectionEditors = {};
HashBrown.Views.Editors.FieldEditors = require('Client/Views/Editors/FieldEditors');
HashBrown.Helpers = require('Client/Helpers');

// Helper shortcuts
window.debug = HashBrown.Helpers.DebugHelper;
window.UI = HashBrown.Helpers.UIHelper;

// Helper functions
require('Client/helpers');

// Preload resources 
document.addEventListener('DOMContentLoaded', () => {
    const SettingsHelper = HashBrown.Helpers.SettingsHelper;
    const LanguageHelper = HashBrown.Helpers.LanguageHelper;
    const ProjectHelper = HashBrown.Helpers.ProjectHelper;

    $('.page--environment__spinner').toggleClass('hidden', false);

    // Start debug socket
    debug.startSocket();

    SettingsHelper.getSettings(ProjectHelper.currentProject, null, 'sync')
    .then(() => {
        return LanguageHelper.getLanguages(ProjectHelper.currentProject);
    })
    .then(() => {
        return HashBrown.Helpers.RequestHelper.reloadAllResources();
    })
    .then(() => {
        for(let user of resources.users) {
            if(user.isCurrent) {
                HashBrown.Models.User.current = user;
            }
        }
       
        new HashBrown.Views.Navigation.NavbarMain();
        new HashBrown.Views.Navigation.MainMenu();

        Crisp.Router.check = (newRoute, cancel, proceed) => {
            let contentEditor = Crisp.View.get('ContentEditor');

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

        $('.page--environment__spinner').toggleClass('hidden', true);

        Crisp.Router.init();
    })
    .catch((e) => {
        UI.errorModal(e);
    });
});
