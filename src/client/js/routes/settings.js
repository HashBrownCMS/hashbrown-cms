'use strict';

// Dashboard
Router.route('/settings/', function() {
    if(currentUserHasScope('settings')) {
        ViewHelper.get('NavbarMain').showTab('/settings/');
        
        $('.workspace').html(
            _.div({class: 'dashboard-container'},
                _.h1('Settings dashboard'),
                _.p('Please click on a settings item to proceed')
            )
        );
    
    } else {
        location.hash = '/';

    }
});

// Edit
Router.route('/settings/languages/', function() {
    if(currentUserHasScope('settings')) {
        ViewHelper.get('NavbarMain').highlightItem('languages');
        
        $('.workspace').html(
            new LanguageSettings().$element
        );
    
    } else {
        location.hash = '/';

    }
});
