'use strict';

// Root reroute
Crisp.Router.route('/', () => {
    Crisp.Router.go('/content/');
});

// Dashboard
Crisp.Router.route('/content/', () => {
    Crisp.View.get('NavbarMain').showTab('/content/');

    UI.setEditorSpaceContent(
        [
            _.h1('Content'),
            _.p('Right click in the Content pane to create new Content.'),
            _.p('Click on a Content node to edit it.'),
            _.button({class: 'widget widget--button'}, 'New Content')
                .click(() => { HashBrown.Views.Navigation.ContentPane.onClickNewContent(); }),
            _.button({class: 'widget widget--button'}, 'Quick tour')
                .click(HashBrown.Helpers.ContentHelper.startTour),
            _.button({class: 'widget widget--button condensed', title: 'Click here to get some example content'}, 'Get example content')
                .click(async () => {
                    await HashBrown.Helpers.RequestHelper.request('post', 'content/example');

                    await HashBrown.Helper.ResourceHelper.preloadAllResources();
                
                    HashBrown.Views.Navigation.NavbarMain.reload();  
                })
        ],
        'text'
    );
});

// Edit (JSON editor)
Crisp.Router.route('/content/json/:id', () => {
    Crisp.View.get('NavbarMain').highlightItem('/content/', Crisp.Router.params.id);
    
    let contentEditor = new HashBrown.Views.Editors.JSONEditor({
        modelUrl: HashBrown.Helpers.RequestHelper.environmentUrl('content/' + Crisp.Router.params.id),
        apiPath: 'content/' + Crisp.Router.params.id
    });

    UI.setEditorSpaceContent(contentEditor.$element);
});

// Edit (redirect to default tab)
Crisp.Router.route('/content/:id', async () => {
    let id = Crisp.Router.params.id;
    
    let content = await HashBrown.Helpers.ContentHelper.getContentById(id);
    
    if(content) {
        let contentSchema = await HashBrown.Helpers.SchemaHelper.getSchemaById(content.schemaId);

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
    let id = Crisp.Router.params.id;

    Crisp.View.get('NavbarMain').highlightItem('/content/', id);

    let contentEditor = Crisp.View.get('ContentEditor');

    if(!contentEditor) {
        contentEditor = new HashBrown.Views.Editors.ContentEditor(id);
        UI.setEditorSpaceContent(contentEditor.$element);
   
    } else if(!contentEditor.model || contentEditor.model.id !== id) {
        contentEditor.remove();

        contentEditor = new HashBrown.Views.Editors.ContentEditor(id);
        UI.setEditorSpaceContent(contentEditor.$element);
    
    } else {
        contentEditor.fetch();

    }
});

