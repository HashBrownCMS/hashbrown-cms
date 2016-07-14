'use strict';

// Dashboard
Router.route('/forms/', function() {
    ViewHelper.get('NavbarMain').showTab('/forms/');
    
    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Forms dashboard'),
            _.p('Please click on a form to proceed')
        )
    );
});

// Edit
Router.route('/forms/:id', function() {
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    let formEditor = new FormEditor({
        modelUrl: apiUrl('forms/' + this.id)
    });
   
    $('.workspace').html(formEditor.$element);
});

// Edit (JSON editor)
Router.route('/forms/json/:id', function() {
    let formEditor = new JSONEditor({
        modelUrl: apiUrl('forms/' + this.id),
        apiPath: 'forms/' + this.id
    });
     
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(formEditor.$element);
});
