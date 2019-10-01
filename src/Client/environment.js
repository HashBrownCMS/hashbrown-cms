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
    HashBrown.Context.language = localStorage.getItem('language') || 'en';
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
