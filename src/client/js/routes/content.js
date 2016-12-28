'use strict';

// Dashboard
Router.route('/content/', function() {
    ViewHelper.get('NavbarMain').showTab('/content/');
    
    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Content dashboard'),
            _.p('Please click on a content node to proceed')
        )
    );
});

// Edit (JSON editor)
Router.route('/content/json/:id', function() {
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    let contentEditor = new JSONEditor({
        modelUrl: apiUrl('content/' + this.id),
        apiPath: 'content/' + this.id
    });

    $('.workspace').html(contentEditor.$element);
});

// Edit (redirect to default tab)
Router.route('/content/:id', function() {
    let content = resources.content.filter((c) => { return c.id == this.id; })[0];

    if(content) {
        let contentSchema = resources.schemas[content.schemaId];

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
Router.route('/content/:id/:tab', function() {
    let contentEditor = ViewHelper.get('ContentEditor');
  
    if(!contentEditor || contentEditor.model.id != this.id) {
        ViewHelper.get('NavbarMain').highlightItem(this.id);
   
        contentEditor = new ContentEditor({
            modelUrl: apiUrl('content/' + this.id)
        });
        
        $('.workspace').html(contentEditor.$element);
    }
});

