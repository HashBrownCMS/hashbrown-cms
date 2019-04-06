'use strict';

/**
 * @namespace HashBrown.Client
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Check that all submodules are loaded
    submoduleCheck();
    
    // Libraries
    window._ = Crisp.Elements;

    // Helper shortcuts
    window.debug = HashBrown.Helpers.DebugHelper;
    window.UI = HashBrown.Helpers.UIHelper;

    // Error handling
    window.onerror = UI.errorModal;
   
    // Preload resources
    if(!HashBrown.Context.isMediaPicker) {
        await HashBrown.Helpers.ResourceHelper.preloadAllResources();
    }

    // Get language
    HashBrown.Context.language = localStorage.getItem('language') || 'en';

    // Init current user
    HashBrown.Context.user = new HashBrown.Models.User(HashBrown.Context.user);

    // Init UI
    new HashBrown.Views.Navigation.NavbarMain();
    new HashBrown.Views.Navigation.MainMenu();

    // Set router check
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
            'You have made changes to "' + (contentEditor.model.prop('title', HashBrown.Context.language) || contentEditor.model.id) + '"',
            () => {
                contentEditor.dirty = false;
                proceed();
            },
            cancel
        );
    };

    Crisp.Router.init();
});
