'use strict';

// Dashboard
Crisp.Router.route('/forms/', function() {
    HashBrown.Helpers.EventHelper.trigger('route');
    
    UI.setEditorSpaceContent(
        [
            _.h1('Forms'),
            _.p('Right click in the Forms pane to create a new Form.'),
            _.p('Click on a Form to edit it.'),
            _.button({class: 'widget widget--button'}, 'New Form')
                .click(() => { HashBrown.Views.Navigation.FormsPane.onClickNewForm(); }),
            _.button({class: 'widget widget--button'}, 'Quick tour')
                .click(HashBrown.Helpers.FormHelper.startTour),
        ],
        'text'
    );
});

// Edit
Crisp.Router.route('/forms/:id', function() {
    HashBrown.Helpers.EventHelper.trigger('route');
    
    let formEditor = new HashBrown.Views.Editors.FormEditor({
        modelUrl: HashBrown.Helpers.RequestHelper.environmentUrl('forms/' + this.id)
    });
   
    UI.setEditorSpaceContent(formEditor.$element);
});

// Edit (JSON editor)
Crisp.Router.route('/forms/json/:id', function() {
    HashBrown.Helpers.EventHelper.trigger('route');
    
    let formEditor = new HashBrown.Views.Editors.JSONEditor({
        modelId: this.id,
        resourceCategory: 'forms'
    });
    
    UI.setEditorSpaceContent(formEditor.$element);
});
