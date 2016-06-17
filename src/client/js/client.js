'use strict';

// Helper functions
require('./helpers');

// -----------
// Preload resources 
// -----------
$(document).ready(() => {
    reloadAllResources()
    .then(function() {
        triggerReady('resources');
    });
});

// -----------
// Language
// -----------
window.language = localStorage.getItem('language') || 'en';

// -----------
// Routes
// -----------
// Get routes
require('./routes/index');

// Init
onReady('resources', function() {
    new NavbarMain();

    Router.init();
});
