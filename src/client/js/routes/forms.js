'use strict';

// Dashboard
Router.route('/forms/', function() {
    ViewHelper.get('NavbarMain').showTab('/forms/');
    
    populateWorkspace(
        _.div({class: 'dashboard-container'},
            _.h1('Forms'),
            _.p('Please click on a form to proceed')
        ),
        'presentation presentation-center'
    );
});

// Edit
Router.route('/forms/:id', function() {
    ViewHelper.get('NavbarMain').highlightItem('/forms/', this.id);
    
    let formEditor = new FormEditor({
        modelUrl: apiUrl('forms/' + this.id)
    });
   
    populateWorkspace(formEditor.$element);
});

// Edit (JSON editor)
Router.route('/forms/json/:id', function() {
    let formEditor = new JSONEditor({
        modelUrl: apiUrl('forms/' + this.id),
        apiPath: 'forms/' + this.id
    });
     
    ViewHelper.get('NavbarMain').highlightItem('/forms/', this.id);
    
    populateWorkspace(formEditor.$element);
});
