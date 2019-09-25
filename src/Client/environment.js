'use strict';

/**
 * @namespace HashBrown.Client
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Check that all submodules are loaded
    submoduleCheck();
    
    // Libraries
    window._ = Crisp.Elements;

    // Service shortcuts
    window.debug = HashBrown.Service.DebugService;
    window.UI = HashBrown.Service.UIService;

    // Error handling
    window.addEventListener('error', (e) => { UI.error(e); });
   
    // Set context variables
    HashBrown.Context.language = localStorage.getItem('language') || 'en';
    HashBrown.Context.user = new HashBrown.Entity.Resource.User(HashBrown.Context.user);

    // Preload schemas
    await HashBrown.Service.SchemaService.getAllSchemas();

    // Init router
    HashBrown.Service.NavigationService.startListening();
    
    // Check for updates
    updateCheck();
});
