'use strict';

/**
 * @namespace HashBrown.Client
 */
document.addEventListener('DOMContentLoaded', () => {
    // Resource cache
    window.resources = {
        connections: [],
        content: [],
        schemas: [],
        media: [],
        forms: [],
        users: []
    };

    // Libraries
    window._ = Crisp.Elements;
    window.Promise = require('bluebird');
    window.marked = require('marked');

    // Helper shortcuts
    window.debug = HashBrown.Helpers.DebugHelper;
    window.UI = HashBrown.Helpers.UIHelper;

    // Get package file
    window.app = require('package.json');

    // Language
    window.language = localStorage.getItem('language') || 'en';

    // Preload resources
    $('.page--environment__spinner').toggleClass('hidden', false);

    HashBrown.Helpers.SettingsHelper.getSettings(HashBrown.Helpers.ProjectHelper.currentProject, null, 'sync')
    .then(() => {
        return HashBrown.Helpers.LanguageHelper.getLanguages(HashBrown.Helpers.ProjectHelper.currentProject);
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
            UI.highlight(false);

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
