'use strict';

const RequestHelper = require('Client/Helpers/RequestHelper');

// Dashboard
Crisp.Router.route('/connections/', function() {
    if(currentUserHasScope('connections')) {
        Crisp.View.get('NavbarMain').showTab('/connections/');
        
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
Crisp.Router.route('/connections/:id', function() {
    if(currentUserHasScope('connections')) {
        let connectionEditor = new HashBrown.Views.Editors.ConnectionEditor({
            modelUrl: RequestHelper.environmentUrl('connections/' + this.id)
        });
       
        Crisp.View.get('NavbarMain').highlightItem('/connections/', this.id);
        
        populateWorkspace(connectionEditor.$element);
    
    } else {
        location.hash = '/';

    }
});

// Edit (JSON editor)
Crisp.Router.route('/connections/json/:id', function() {
    if(currentUserHasScope('connections')) {
        let connectionEditor = new HashBrown.Views.Editors.JSONEditor({
            apiPath: 'connections/' + this.id
        });
         
        Crisp.View.get('NavbarMain').highlightItem('/connections/', this.id);
        
        populateWorkspace(connectionEditor.$element);
    
    } else {
        location.hash = '/';

    }
});
