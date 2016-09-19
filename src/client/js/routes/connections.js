'use strict';

// Dashboard
Router.route('/connections/', function() {
    if(currentUserHasScope('connections')) {
        ViewHelper.get('NavbarMain').showTab('/connections/');
        
        $('.workspace').html(
            _.div({class: 'dashboard-container'},
                _.h1('Connections dashboard'),
                _.p('Please click on a connection to proceed')
            )
        );
    
    } else {
        location.hash = '/';

    }
});

// Edit
Router.route('/connections/:id', function() {
    if(currentUserHasScope('connections')) {
        let connectionEditor = new ConnectionEditor({
            modelUrl: apiUrl('connections/' + this.id)
        });
       
        ViewHelper.get('NavbarMain').highlightItem(this.id);
        
        $('.workspace').html(connectionEditor.$element);
    
    } else {
        location.hash = '/';

    }
});

// Edit (JSON editor)
Router.route('/connections/json/:id', function() {
    if(currentUserHasScope('connections')) {
        let connectionEditor = new JSONEditor({
            apiPath: 'connections/' + this.id
        });
         
        ViewHelper.get('NavbarMain').highlightItem(this.id);
        
        $('.workspace').html(connectionEditor.$element);
    
    } else {
        location.hash = '/';

    }
});
