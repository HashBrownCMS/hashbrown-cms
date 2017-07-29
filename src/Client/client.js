'use strict';

window.isClient = true;
window.isServer = false;

// Style
require('Style/client');

// Helper functions
require('Client/helpers');

// Libraries
require('crisp-ui');

// Get routes
require('Client/Routes');

// Resource cache
window.resources = {
    connections: {},
    content: [],
    schemas: [],
    media: [],
    templates: [],
    forms: [],
    users: []
};

// Namespaces
window.HashBrown = {};

HashBrown.Client = {};
HashBrown.Client.Models = require('Common/Models');
HashBrown.Client.Views = {};
HashBrown.Client.Views.Modals = require('Client/Views/Modals');
HashBrown.Client.Views.Navigation = require('Client/Views/Navigation');
HashBrown.Client.Views.Editors = require('Client/Views/Editors');
HashBrown.Client.Views.Editors.ConnectionEditors = {};
HashBrown.Client.Views.Editors.FieldEditors = require('Client/Views/Editors/FieldEditors');
HashBrown.Client.Helpers = require('Client/Helpers');

HashBrown.Common = {};
HashBrown.Common.Models = require('Common/Models');

// Helper shortcuts
window.debug = require('Common/Helpers/DebugHelper');
window.UI = require('Client/Helpers/UIHelper');

// Preload resources 
$(document).ready(() => {
    const SettingsHelper = HashBrown.Client.Helpers.SettingsHelper;
    const LanguageHelper = HashBrown.Client.Helpers.LanguageHelper;
    const ProjectHelper = HashBrown.Client.Helpers.ProjectHelper;

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
                HashBrown.Common.Models.User.current = user;
            }
        }
       
        new HashBrown.Client.Views.Navigation.NavbarMain();
        new HashBrown.Client.Views.Navigation.MainMenu();

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
