'use strict';

// Dashboard
Router.route('/settings/', function() {
    if(currentUserHasScope('settings')) {
        ViewHelper.get('NavbarMain').showTab('/settings/');
        
        populateWorkspace(
            _.div({class: 'dashboard-container'},
                _.h1('Settings'),
                _.p('Please click on a section to proceed')
            ),
            'presentation presentation-center'
        );
    
    } else {
        location.hash = '/';

    }
});

// Sync
Router.route('/settings/sync/', function() {
    if(currentUserHasScope('settings')) {
        ViewHelper.get('NavbarMain').highlightItem('/settings/', 'sync');
        
        populateWorkspace(
            new SyncSettings().$element
        );
    
    } else {
        location.hash = '/';

    }
});

// Providers
Router.route('/settings/providers/', function() {
    if(currentUserHasScope('settings')) {
        ViewHelper.get('NavbarMain').highlightItem('/settings/', 'providers');
        
        populateWorkspace(
            new ProvidersSettings().$element
        );
    
    } else {
        location.hash = '/';

    }
});
