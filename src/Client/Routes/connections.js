'use strict';

// Dashboard
Crisp.Router.route('/connections/', () => {
    if(!currentUserHasScope('connections')) { return location.hash = '/'; }

    HashBrown.Helpers.EventHelper.trigger('route');
    
    UI.setEditorSpaceContent(
        [
            _.h1('Connections'),
            _.p('Right click in the Connections pane to create a new Connection.'),
            _.p('Click on a Connection to edit it.'),
            _.button({class: 'widget widget--button'}, 'New Connection')
                .click(() => { HashBrown.Views.Navigation.ConnectionPane.onClickNewConnection(); }),
            _.button({class: 'widget widget--button'}, 'Quick tour')
                .click(HashBrown.Helpers.ConnectionHelper.startTour),
        ],
        'text'
    );
});

// Edit
Crisp.Router.route('/connections/:id', () => {
    if(!currentUserHasScope('connections')) { return location.hash = '/'; }

    HashBrown.Helpers.EventHelper.trigger('route');
    
    let connectionEditor = new HashBrown.Views.Editors.ConnectionEditor({
        modelUrl: HashBrown.Helpers.RequestHelper.environmentUrl('connections/' + Crisp.Router.params.id)
    });
   
    UI.setEditorSpaceContent(connectionEditor.$element);
});

// Edit (JSON editor)
Crisp.Router.route('/connections/json/:id', () => {
    if(!currentUserHasScope('connections')) { return location.hash = '/'; }

    HashBrown.Helpers.EventHelper.trigger('route');
    
    let connectionEditor = new HashBrown.Views.Editors.JSONEditor({
        modelId: Crisp.Router.params.id,
        resourceCategory: 'connections'
    });
    
    UI.setEditorSpaceContent(connectionEditor.$element);
});
