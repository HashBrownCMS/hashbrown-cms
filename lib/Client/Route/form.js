'use strict';

// Dashboard
Crisp.Router.route('/forms/', function() {
    HashBrown.Service.EventService.trigger('route');
    
    UI.setEditorSpaceContent(
        [
            _.h1('Forms'),
            _.p('Right click in the Forms pane to create a new Form.'),
            _.p('Click on a Form to edit it.'),
            _.button({class: 'widget widget--button'}, 'New Form')
                .click(() => { Crisp.View.get('FormPane').onClickNewForm(); }),
            _.button({class: 'widget widget--button'}, 'Quick tour')
                .click(HashBrown.Service.FormService.startTour),
        ],
        'text'
    );
});

// Edit
Crisp.Router.route('/forms/:id', () => {
    HashBrown.Service.EventService.trigger('route');
    
    let formEditor = new HashBrown.View.Editor.FormEditor({
        modelId: Crisp.Router.params.id
    });
   
    UI.setEditorSpaceContent(formEditor.$element);
});

// Edit (JSON editor)
Crisp.Router.route('/forms/json/:id', () => {
    HashBrown.Service.EventService.trigger('route');
    
    let formEditor = new HashBrown.View.Editor.JSONEditor({
        modelId: Crisp.Router.params.id,
        resourceCategory: 'forms'
    });
    
    UI.setEditorSpaceContent(formEditor.$element);
});
