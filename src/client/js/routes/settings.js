'use strict';

// Dashboard
Router.route('/settings/', function() {
    ViewHelper.get('NavbarMain').showTab('/settings/');
    
    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Settings dashboard'),
            _.p('Please click on a settings item to proceed')
        )
    );
});

// Edit
Router.route('/settings/languages/', function() {
    ViewHelper.get('NavbarMain').highlightItem('languages');
    
    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            new LanguageSettings().$element
        )
    );

});
