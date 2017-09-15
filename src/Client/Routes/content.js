'use strict';

const RequestHelper = require('Client/Helpers/RequestHelper');

// Dashboard
Crisp.Router.route('/content/', function() {
    Crisp.View.get('NavbarMain').showTab('/content/');
    
    populateWorkspace(
        _.div({class: 'dashboard-container'},
            _.h1('Content'),
            _.p('Please click on a content node to proceed')
        ),
        'presentation presentation-center'
    );
});

// Edit (JSON editor)
Crisp.Router.route('/content/json/:id', function() {
    Crisp.View.get('NavbarMain').highlightItem('/content/', this.id);
    
    let contentEditor = new HashBrown.Views.Editors.JSONEditor({
        modelUrl: RequestHelper.environmentUrl('content/' + this.id),
        apiPath: 'content/' + this.id
    });

    populateWorkspace(contentEditor.$element);
});

// Edit (redirect to default tab)
Crisp.Router.route('/content/:id', function() {
    let content = HashBrown.Helpers.ContentHelper.getContentByIdSync(this.id);

    if(content) {
        let contentSchema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(content.schemaId);

        if(contentSchema) {
            location.hash = '/content/' + this.id + '/' + (contentSchema.defaultTabId || 'meta');
        
        } else {
            UI.errorModal(new Error('Schema by id "' + content.schemaId + '" not found'), () => { location.hash = '/content/json/' + this.id; });

        }
    
    } else {
        UI.errorModal(new Error('Content by id "' + this.id + '" not found'));

    }
});

// Edit (with tab specified)
Crisp.Router.route('/content/:id/:tab', function() {
    let contentEditor = Crisp.View.get('ContentEditor');
  
    if(!contentEditor || !contentEditor.model || contentEditor.model.id != this.id) {
        Crisp.View.get('NavbarMain').highlightItem('/content/', this.id);
   
        contentEditor = new HashBrown.Views.Editors.ContentEditor({
            modelUrl: RequestHelper.environmentUrl('content/' + this.id)
        });
        
        populateWorkspace(contentEditor.$element);
    }
});

