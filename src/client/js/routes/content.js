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
    ContentHelper.getContentById(this.id)
    .then((content) => {
        let contentEditor = new JSONEditor({
            model: content,
            apiPath: 'content/' + this.id
        });

        ViewHelper.get('NavbarMain').highlightItem(this.id);
        
        $('.workspace').html(contentEditor.$element);
    });
});

// Edit
Router.route('/content/:id', function() {
    let contentEditor = new ContentEditor({
        modelUrl: apiUrl('content/' + this.id)
    });
   
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(contentEditor.$element);
});

// Edit (with tab specified)
Router.route('/content/:id/:tab', function() {
    let contentEditor = ViewHelper.get('ContentEditor');
   
    if(!contentEditor) {
        contentEditor = new ContentEditor({
            modelUrl: apiUrl('content/' + this.id)
        });
   
        ViewHelper.get('NavbarMain').highlightItem(this.id);
    
        $('.workspace').html(contentEditor.$element);
    }
});

