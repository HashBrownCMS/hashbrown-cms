'use strict';

const RequestHelper = require('Client/Helpers/RequestHelper');
const SchemaHelper = require('Client/Helpers/SchemaHelper');

// Dashboard
Crisp.Router.route('/schemas/', function() {
    if(currentUserHasScope('schemas')) {
        Crisp.View.get('NavbarMain').showTab('/schemas/');
        
        populateWorkspace(
            _.div({class: 'dashboard-container'},
                _.h1('Schemas'),
                _.p('Please click on a schema to proceed')
            ),
            'presentation presentation-center'
        );
    
    } else {
        location.hash = '/';

    }
});

// Edit
Crisp.Router.route('/schemas/:id', function() {
    if(currentUserHasScope('schemas')) {
        let schemaEditor = new HashBrown.Views.Editors.SchemaEditor({
            modelUrl: RequestHelper.environmentUrl('schemas/' + this.id)
        });
        
        Crisp.View.get('NavbarMain').highlightItem('/schemas/', this.id);
        
        populateWorkspace(schemaEditor.$element);
    
    } else {
        location.hash = '/';

    }
});

// Edit (JSON editor)
Crisp.Router.route('/schemas/json/:id', function() {
    if(currentUserHasScope('schemas')) {
        let jsonEditor = new HashBrown.Views.Editors.JSONEditor({
            model: SchemaHelper.getSchemaByIdSync(this.id),
            apiPath: 'schemas/' + this.id,
            onSuccess: () => {
                return RequestHelper.reloadResource('schemas')
                .then(() => {
                    let navbar = Crisp.View.get('NavbarMain');
                    
                    navbar.reload();
                });
            }
        });

        Crisp.View.get('NavbarMain').highlightItem('/schemas/', this.id);
        
        populateWorkspace(jsonEditor.$element);
    
    } else {
        location.hash = '/';

    }
});
