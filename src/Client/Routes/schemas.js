'use strict';

// Dashboard
Crisp.Router.route('/schemas/', function() {
    if(!currentUserHasScope('schemas')) { return location.hash = '/'; }
    
    HashBrown.Helpers.EventHelper.trigger('route');
    
    UI.setEditorSpaceContent(
        [
            _.h1('Schemas'),
            _.p('Right click in the Schemas pane to create a new Schema.'),
            _.p('Click on a Schema to edit it.'),
            _.button({class: 'widget widget--button'}, 'Import schemas')
                .click(() => {
                    let url = '';

                    let modal = UI.messageModal(
                        'Import schemas',
                        _.div({class: 'widget-group'},
                            _.div({class: 'widget widget--label'}, 'URL to uischema.org instance'),
                            new HashBrown.Views.Widgets.Input({
                                type: 'text',
                                placeholder: 'https://uischema.org',
                                onChange: (newValue) => {
                                    url = newValue;
                                }
                            })
                        ),
                        async () => {
                            await HashBrown.Helpers.RequestHelper.request('post', 'schemas/import?url=' + url);
                            
                            await HashBrown.ResourceHelper.reloadResource('schemas');
                        }
                    );

                    modal.$element.find('input').focus();
                })
        ],
        'text'
    );
});

// Edit
Crisp.Router.route('/schemas/:id', async () => {
    if(!currentUserHasScope('schemas')) { return location.hash = '/'; }

    HashBrown.Helpers.EventHelper.trigger('route');
 
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
    if(!currentUserHasScope('schemas')) { return location.hash = '/'; }

    HashBrown.Helpers.EventHelper.trigger('route');
    
    let jsonEditor = new HashBrown.Views.Editors.JSONEditor({
        modelId: this.id,
        resourceCategory: 'schemas'
    });

    UI.setEditorSpaceContent(jsonEditor.$element);
});
