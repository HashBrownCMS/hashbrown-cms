'use strict';

// Dashboard
Crisp.Router.route('/connections/', () => {
    if(!currentUserHasScope('connections')) { return location.hash = '/'; }

    HashBrown.Service.EventService.trigger('route');
    
    UI.setEditorSpaceContent(
        [
            _.h1('Connections'),
            _.button({class: 'widget widget--button'}, 'New connection')
                .click(() => { Crisp.View.get('ConnectionPane').onClickNewConnection(); }),
            _.button({class: 'widget widget--button'}, 'Quick tour')
                .click(HashBrown.Service.ConnectionService.startTour),
        ],
        'text'
    );
});

// Edit
Crisp.Router.route('/connections/:id', () => {
    if(!currentUserHasScope('connections')) { return location.hash = '/'; }

    HashBrown.Service.EventService.trigger('route');
    
    let connectionEditor = new HashBrown.View.Editor.ConnectionEditor({
        modelId: Crisp.Router.params.id
    });
   
    UI.setEditorSpaceContent(connectionEditor.$element);
});

// Edit (JSON editor)
Crisp.Router.route('/connections/json/:id', () => {
    if(!currentUserHasScope('connections')) { return location.hash = '/'; }

    HashBrown.Service.EventService.trigger('route');
    
    let connectionEditor = new HashBrown.View.Editor.JSONEditor({
        modelId: Crisp.Router.params.id,
        resourceCategory: 'connections'
    });
    
    UI.setEditorSpaceContent(connectionEditor.$element);
});
