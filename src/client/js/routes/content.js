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
    })
    .catch(errorModal);
});

// Edit (redirect to meta tab)
Router.route('/content/:id', function() {
    location.hash = '/content/' + this.id + '/meta';
});

// Edit (with tab specified)
Router.route('/content/:id/:tab', function() {
    let contentEditor = ViewHelper.get('ContentEditor');
  
    if(!contentEditor || contentEditor.model.id != this.id) {
        ContentHelper.getContentById(this.id)
        .then((content) => { 
            ViewHelper.get('NavbarMain').highlightItem(this.id);
       
            contentEditor = new ContentEditor({
                model: content
            });

            $('.workspace').html(contentEditor.$element);
        })
        .catch(errorModal);
    }
});

