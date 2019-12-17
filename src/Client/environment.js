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
    HashBrown.Context.language = localStorage.getItem('language');

    if(HashBrown.Context.projectSettings && HashBrown.Context.projectSettings.languages && HashBrown.Context.projectSettings.languages.indexOf(HashBrown.Context.language) < 0) {
        HashBrown.Context.language = HashBrown.Context.projectSettings.languages[0];
    }

    HashBrown.Context.user = new HashBrown.Entity.Resource.User(HashBrown.Context.user);

    // Init router
    HashBrown.Service.NavigationService.startListening();

    // Init escape key handler
    document.addEventListener('keydown', (e) => {
        if(e.which === 27) { HashBrown.Service.EventService.trigger('escape'); }
    });

    // Check for updates
    updateCheck();
});
