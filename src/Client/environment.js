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

    // Preload schemas
    document.body.classList.toggle('loading', true);
    await HashBrown.Service.SchemaService.getAllSchemas();
    document.body.classList.toggle('loading', false);

    // Init router
    HashBrown.Service.NavigationService.startListening();
    
    // Check for updates
    updateCheck();
});
