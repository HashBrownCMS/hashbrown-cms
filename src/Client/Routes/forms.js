'use strict';

const JSONEditor = require('Client/Views/Editors/JSONEditor');
const FormEditor = require('Client/Views/Editors/FormEditor');
const RequestHelper = require('Client/Helpers/RequestHelper');

// Dashboard
Crisp.Router.route('/forms/', function() {
    Crisp.View.get('NavbarMain').showTab('/forms/');
    
    populateWorkspace(
        _.div({class: 'dashboard-container'},
            _.h1('Forms'),
            _.p('Please click on a form to proceed')
        ),
        'presentation presentation-center'
    );
});

// Edit
Crisp.Router.route('/forms/:id', function() {
    Crisp.View.get('NavbarMain').highlightItem('/forms/', this.id);
    
    let formEditor = new FormEditor({
        modelUrl: RequestHelper.environmentUrl('forms/' + this.id)
    });
   
    populateWorkspace(formEditor.$element);
});

// Edit (JSON editor)
Crisp.Router.route('/forms/json/:id', function() {
    let formEditor = new JSONEditor({
        modelUrl: RequestHelper.environmentUrl('forms/' + this.id),
        apiPath: 'forms/' + this.id
    });
     
    Crisp.View.get('NavbarMain').highlightItem('/forms/', this.id);
    
    populateWorkspace(formEditor.$element);
});
