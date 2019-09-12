'use strict';

// Root reroute
Crisp.Router.route('/', () => {
    Crisp.Router.go('/content/');
});

// Dashboard
Crisp.Router.route('/content/', () => {
    HashBrown.Service.EventService.trigger('route');
    
    UI.setEditorSpaceContent(
        [
            _.h1('Content'),
            _.p('Right click in the Content pane to create new Content.'),
            _.p('Click on a Content node to edit it.'),
            _.button({class: 'widget widget--button'}, 'New Content')
                .click(() => { Crisp.View.get('ContentPane').onClickNewContent(); }),
            _.button({class: 'widget widget--button'}, 'Quick tour')
                .click(HashBrown.Service.ContentService.startTour),
            _.button({class: 'widget widget--button condensed', title: 'Click here to get some example content'}, 'Get example content')
                .click(async () => {
                    await HashBrown.Service.RequestService.request('post', 'content/example');

                    await HashBrown.Service.ResourceService.preloadAllResources();
                })
        ],
        'text'
    );
});

// Edit (JSON editor)
Crisp.Router.route('/content/json/:id', async () => {
    HashBrown.Service.EventService.trigger('route');
    
    let contentEditor = new HashBrown.View.Editor.JSONEditor({
        modelId: Crisp.Router.params.id,
        resourceCategory: 'content'
    });

    UI.setEditorSpaceContent(contentEditor.$element);
});

// Edit (redirect to default tab)
Crisp.Router.route('/content/:id', async () => {
    let id = Crisp.Router.params.id;
    
    let content = await HashBrown.Service.ContentService.getContentById(id);
    
    if(content) {
        let contentSchema = await HashBrown.Service.SchemaService.getSchemaById(content.schemaId);

        if(contentSchema) {
            location.hash = '/content/' + Crisp.Router.params.id + '/' + (contentSchema.defaultTabId || 'meta');
        
        } else {
            UI.errorModal(new Error('Schema by id "' + content.schemaId + '" not found'), () => { location.hash = '/content/json/' + Crisp.Router.params.id; });

        }
    
    } else {
        UI.errorModal(new Error('Content by id "' + Crisp.Router.params.id + '" not found'));

    }
});

// Edit (with tab specified)
Crisp.Router.route('/content/:id/:tab', () => {
    HashBrown.Service.EventService.trigger('route');

    let id = Crisp.Router.params.id;
    let contentEditor = Crisp.View.get('ContentEditor');

    if(!contentEditor) {
        contentEditor = new HashBrown.View.Editor.ContentEditor(id);
        UI.setEditorSpaceContent(contentEditor.$element);
   
    } else if(!contentEditor.model || contentEditor.model.id !== id) {
        contentEditor.remove();

        contentEditor = new HashBrown.View.Editor.ContentEditor(id);
        UI.setEditorSpaceContent(contentEditor.$element);
    
    }
});

