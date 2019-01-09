'use strict';

// Dashboard
Crisp.Router.route('/connections/', function() {
    if(currentUserHasScope('connections')) {
        Crisp.View.get('NavbarMain').showTab('/connections/');
        
        UI.setEditorSpaceContent(
            [
                _.h1('Connections'),
                _.p('Right click in the Connections pane to create a new Connection.'),
                _.p('Click on a Connection to edit it.'),
                _.button({class: 'widget widget--button'}, 'New Connection')
                    .click(() => { HashBrown.Views.Navigation.ConnectionPane.onClickNewConnection(); }),
            ],
            'text'
        );
    
    } else {
        location.hash = '/';

    }
});

// Edit
Crisp.Router.route('/connections/:id', function() {
    if(currentUserHasScope('connections')) {
        let connectionEditor = new HashBrown.Views.Editors.ConnectionEditor({
            modelUrl: HashBrown.Helpers.RequestHelper.environmentUrl('connections/' + this.id)
        });
       
        Crisp.View.get('NavbarMain').highlightItem('/connections/', this.id);
        
        UI.setEditorSpaceContent(connectionEditor.$element);
    
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
        
        UI.setEditorSpaceContent(connectionEditor.$element);
    
    } else {
        location.hash = '/';

    }
});
