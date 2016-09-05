'use strict';

// Dashboard
Router.route('/connections/', function() {
    ViewHelper.get('NavbarMain').showTab('/connections/');
    
    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Connections dashboard'),
            _.p('Please click on a connection to proceed')
        )
    );
});

// Edit
Router.route('/connections/:id', function() {
    let connectionEditor = new ConnectionEditor({
        modelUrl: apiUrl('connections/' + this.id)
    });
   
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(connectionEditor.$element);
});

// Edit (JSON editor)
Router.route('/connections/json/:id', function() {
    let connectionEditor = new JSONEditor({
        apiPath: 'connections/' + this.id
    });
     
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(connectionEditor.$element);
});
