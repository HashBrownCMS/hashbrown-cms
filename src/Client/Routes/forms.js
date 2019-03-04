'use strict';

// Dashboard
Crisp.Router.route('/forms/', function() {
    Crisp.View.get('NavbarMain').showTab('/forms/');
    
    UI.setEditorSpaceContent(
        [
            _.h1('Forms'),
            _.p('Right click in the Forms pane to create a new Form.'),
            _.p('Click on a Form to edit it.'),
            _.button({class: 'widget widget--button'}, 'New Form')
                .click(() => { HashBrown.Views.Navigation.FormsPane.onClickNewForm(); }),
        ],
        'text'
    );
});

// Edit
Crisp.Router.route('/forms/:id', function() {
    Crisp.View.get('NavbarMain').highlightItem('/forms/', this.id);
    
    let formEditor = new HashBrown.Views.Editors.FormEditor({
        modelUrl: HashBrown.Helpers.RequestHelper.environmentUrl('forms/' + this.id)
    });
   
    UI.setEditorSpaceContent(formEditor.$element);
});

// Edit (JSON editor)
Crisp.Router.route('/forms/json/:id', function() {
    let formEditor = new HashBrown.Views.Editors.JSONEditor({
        modelUrl: HashBrown.Helpers.RequestHelper.environmentUrl('forms/' + this.id),
        apiPath: 'forms/' + this.id
    });
     
    Crisp.View.get('NavbarMain').highlightItem('/forms/', this.id);
    
    UI.setEditorSpaceContent(formEditor.$element);
});
