'use strict';

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
Crisp.Router.route('/schemas/:id', async () => {
    if(!currentUserHasScope('schemas')) { return location.hash = '/'; }

    Crisp.View.get('NavbarMain').highlightItem('/schemas/', Crisp.Router.params.id);
   
    // First get the Schema model
    let schema = await HashBrown.Helpers.SchemaHelper.getSchemaById(Crisp.Router.params.id);

    // Then get the parent Schema, if available
    let parentSchema = null;
    
    if(schema.parentSchemaId) {
        parentSchema = await HashBrown.Helpers.SchemaHelper.getSchemaById(schema.parentSchemaId, true);
    }

    let schemaEditor;

    if(schema instanceof HashBrown.Models.ContentSchema) {
        schemaEditor = new HashBrown.Views.Editors.ContentSchemaEditor({
            model: schema,
            parentSchema: parentSchema
        });
    } else {
        schemaEditor = new HashBrown.Views.Editors.FieldSchemaEditor({
            model: schema,
            parentSchema: parentSchema
        });
    }
        
    UI.setEditorSpaceContent(schemaEditor.$element);
});

// Edit (JSON editor)
Crisp.Router.route('/schemas/json/:id', function() {
    if(currentUserHasScope('schemas')) {
        let jsonEditor = new HashBrown.Views.Editors.JSONEditor({
            modelId: this.id,
            resourceCategory: 'schemas'
        });

        UI.setEditorSpaceContent(jsonEditor.$element);
    
    } else {
        location.hash = '/';

    }
});
