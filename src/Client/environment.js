'use strict';

/**
 * @namespace HashBrown.Client
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Service shortcuts
    window.debug = HashBrown.Service.DebugService;
    window.UI = HashBrown.Service.UIService;

    // Error handling
    window.addEventListener('error', (e) => { UI.error(e); });
   
    // Set context variables
    HashBrown.Context.project = HashBrown.Entity.Project.new(HashBrown.Context.project);
    HashBrown.Context.user = HashBrown.Entity.User.new(HashBrown.Context.user);

    HashBrown.Context.language = localStorage.getItem('language');

    let languages = HashBrown.Context.project.settings.languages;

    if(languages.indexOf(HashBrown.Context.language) < 0) {
        HashBrown.Context.language = languages[0];
    }

    // Init router
    HashBrown.Service.NavigationService.startListening();

    // Init escape key handler
    document.addEventListener('keydown', (e) => {
        if(e.which === 27) { HashBrown.Service.EventService.trigger('escape'); }
    });

    // Check for updates
    updateCheck();
});
