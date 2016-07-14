'use strict';

// Dashboard
Router.route('/forms/', function() {
    ViewHelper.get('NavbarMain').showTab('/forms/');
    
    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Forms dashboard'),
            _.p('Please click on a form to proceed')
        )
    );
});

// Edit
Router.route('/connections/:id', function() {
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    /*let connectionEditor = new ConnectionEditor({
        modelUrl: apiUrl('connections/' + this.id)
    });
   
    $('.workspace').html(connectionEditor.$element);*/
});

// Edit (JSON editor)
Router.route('/forms/json/:id', function() {
    let formsEditor = new JSONEditor({
        modelUrl: apiUrl('forms/' + this.id),
        apiPath: 'forms/' + this.id
    });
     
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(formsEditor.$element);
});
