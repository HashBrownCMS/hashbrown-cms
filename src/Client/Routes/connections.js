'use strict';

// Dashboard
Router.route('/connections/', function() {
    if(currentUserHasScope('connections')) {
        ViewHelper.get('NavbarMain').showTab('/connections/');
        
        populateWorkspace(
            _.div({class: 'dashboard-container'},
                _.h1('Connections'),
                _.p('Please click on a connection to proceed')
            ),
            'presentation presentation-center'
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
       
        ViewHelper.get('NavbarMain').highlightItem('/connections/', this.id);
        
        populateWorkspace(connectionEditor.$element);
    
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
         
        ViewHelper.get('NavbarMain').highlightItem('/connections/', this.id);
        
        populateWorkspace(connectionEditor.$element);
    
    } else {
        location.hash = '/';

    }
});
