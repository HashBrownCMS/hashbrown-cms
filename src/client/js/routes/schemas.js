'use strict';

// Dashboard
Router.route('/schemas/', function() {
    ViewHelper.get('NavbarMain').showTab('/schemas/');
    
    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Schemas dashboard'),
            _.p('Please click on a schema to proceed')
        )
    );
});

// Edit
Router.route('/schemas/:id', function() {
    let schemaEditor = new SchemaEditor({
        model: resources.schemas[this.id]
    });
    
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(schemaEditor.$element);
});

// Edit (JSON editor)
Router.route('/schemas/json/:id', function() {
    let jsonEditor = new JSONEditor({
        model: resources.schemas[this.id],
        apiPath: 'schemas/' + this.id
    });
    
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(jsonEditor.$element);
});
