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
                    let modal = UI.prompt(
                        'Import schemas',
                        'URL to uischema.org definitions',
                        'text',
                        'https://uischema.org/schemas.json',
                        async (url) => {
                            if(!url) { throw new Error('Please specify a URL'); }

                            await HashBrown.Service.RequestService.request('post', 'schemas/import?url=' + url);
                            
                            HashBrown.Service.EventService.trigger('resource');  
                        }
                    );
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
