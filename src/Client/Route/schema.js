'use strict';

// Dashboard
Crisp.Router.route('/schemas/', function() {
    if(!currentUserHasScope('schemas')) { return location.hash = '/'; }
    
    HashBrown.Service.EventService.trigger('route');
    
    UI.setEditorSpaceContent(
        [
            _.h1('Schema'),
            _.p('Right click in the Schema pane to create a new Schema.'),
            _.p('Click on a Schema to edit it.'),
            _.button({class: 'widget widget--button'}, 'Import schemas')
                .click(() => {
                    let url = 'https://uischema.org/schemas.json';

                    let modal = UI.messageModal(
                        'Import schemas',
                        _.div({class: 'widget-group'},
                            _.div({class: 'widget widget--label'}, 'URL to uischema.org definitions'),
                            new HashBrown.Entity.View.Widget.Text({
                                model: {
                                    value: url,
                                    required: true,
                                    placeholder: 'E.g. https://uischema.org/schemas.json',
                                    onchange: (newValue) => {
                                        url = newValue;
                                    }
                                }
                            }).element
                        ),
                        async () => {
                            try {
                                if(!url) { throw new Error('Please specify a URL'); }

                                await HashBrown.Service.RequestService.request('post', 'schema/import?url=' + url);
                                
                                HashBrown.Service.EventService.trigger('resource');  

                            } catch(e) {
                                UI.errorModal(e);
    
                            }
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

    HashBrown.Service.EventService.trigger('route');
 
    // First get the Schema model
    let schema = await HashBrown.Service.SchemaService.getSchemaById(Crisp.Router.params.id);

    let schemaEditor;

    if(schema instanceof HashBrown.Entity.Resource.Schema.ContentSchema) {
        schemaEditor = new HashBrown.View.Editor.ContentSchemaEditor({
            modelId: schema.id
        });
    } else {
        schemaEditor = new HashBrown.View.Editor.FieldSchemaEditor({
            modelId: schema.id
        });
    }
        
    UI.setEditorSpaceContent(schemaEditor.$element);
});

// Edit (JSON editor)
Crisp.Router.route('/schemas/json/:id', function() {
    if(!currentUserHasScope('schemas')) { return location.hash = '/'; }

    HashBrown.Service.EventService.trigger('route');
    
    let jsonEditor = new HashBrown.View.Editor.JSONEditor({
        modelId: this.id,
        resourceCategory: 'schemas'
    });

    UI.setEditorSpaceContent(jsonEditor.$element);
});
