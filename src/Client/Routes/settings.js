'use strict';

// Dashboard
Crisp.Router.route('/settings/', function() {
    if(currentUserHasScope('settings')) {
        Crisp.View.get('NavbarMain').showTab('/settings/');
        
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

// Providers
Crisp.Router.route('/settings/providers/', function() {
    if(currentUserHasScope('settings')) {
        Crisp.View.get('NavbarMain').highlightItem('/settings/', 'providers');
        
        populateWorkspace(
            new HashBrown.Views.Editors.ProvidersSettings().$element
        );
    
    } else {
        location.hash = '/';

    }
});
