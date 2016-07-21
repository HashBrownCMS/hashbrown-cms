'use strict';

// Helper functions
require('./helpers');

// Get package file
window.app = {
    version: require('../../../package.json').version
};

// Preload resources 
$(document).ready(() => {
    reloadAllResources()
    .then(function() {
        triggerReady('resources');
    });
});

// Language
window.language = localStorage.getItem('language') || 'en';

// Get routes
require('./routes/index');

// Init
onReady('resources', function() {
    new NavbarMain();

    Router.init();
});
