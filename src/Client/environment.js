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
    HashBrown.Client.context = new HashBrown.Entity.Context(HashBrown.Client.context);
    HashBrown.Client.language = localStorage.getItem('language');

    let languages = HashBrown.Client.context.project.settings.languages;

    if(languages.indexOf(HashBrown.Client.language) < 0) {
        HashBrown.Client.language = languages[0];
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
