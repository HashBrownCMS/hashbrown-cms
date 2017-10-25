'use strict';

const RequestHelper = require('Client/Helpers/RequestHelper');
const SchemaHelper = require('Client/Helpers/SchemaHelper');

// Dashboard
Crisp.Router.route('/schemas/', function() {
    if(currentUserHasScope('schemas')) {
        Crisp.View.get('NavbarMain').showTab('/schemas/');
        
        UI.setEditorSpaceContent(
            [
                _.h1('Schemas'),
                _.p('Right click in the Schemas pane to create a new Schema.'),
                _.p('Click on a Schema to edit it.')
            ],
            'text'
        );
    
    } else {
        location.hash = '/';

    }
});

// Edit
Crisp.Router.route('/schemas/:id', () => {
    if(currentUserHasScope('schemas')) {
        let schema;
        let compiledSchema;

        Crisp.View.get('NavbarMain').highlightItem('/schemas/', Crisp.Router.params.id);
       
        // First get the Schema model
        SchemaHelper.getSchemaById(Crisp.Router.params.id)
        .then((result) => {
            schema = SchemaHelper.getModel(result);

            return SchemaHelper.getSchemaWithParentFields(Crisp.Router.params.id);
        })

        // Then get the compiled Schema
        .then((result) => {
            compiledSchema = SchemaHelper.getModel(result);

            let schemaEditor;

            if(schema instanceof HashBrown.Models.ContentSchema) {
                schemaEditor = new HashBrown.Views.Editors.ContentSchemaEditor({
                    model: schema,
                    compiledSchema: compiledSchema
                });
            } else {
                schemaEditor = new HashBrown.Views.Editors.FieldSchemaEditor({
                    model: schema,
                    compiledSchema: compiledSchema
                });
            }
            
            UI.setEditorSpaceContent(schemaEditor.$element);
        });
            
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
        
        UI.setEditorSpaceContent(jsonEditor.$element);
    
    } else {
        location.hash = '/';

    }
});
