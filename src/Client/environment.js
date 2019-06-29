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
    window.addEventListener('error', UI.errorModal);
   
    // Set context variables
    HashBrown.Context.language = localStorage.getItem('language') || 'en';
    HashBrown.Context.user = new HashBrown.Models.User(HashBrown.Context.user);

    // Preload schemas
    let spinner = UI.spinner(null, false, '/svg/logo_pink.svg');
    UI.setSpinnerMessage(spinner, 0, 'Loading schemas...');

    await HashBrown.Helpers.SchemaHelper.getAllSchemas();

    UI.setSpinnerMessage(spinner, 0, 'Schemas loaded!', true);
    UI.hideSpinner(spinner);

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
            (!contentEditor.isDirty)
        ) {
            proceed();
            return;
        }

        UI.confirmModal(
            'Discard',
            'Discard unsaved changes?',
            'You have made changes to "' + (contentEditor.model.prop('title', HashBrown.Context.language) || contentEditor.model.id) + '"',
            () => {
                contentEditor.isDirty = false;
                proceed();
            },
            cancel
        );
    };

    Crisp.Router.init();
    
    // Check for updates
    updateCheck();
});
