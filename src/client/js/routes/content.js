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

// Edit
Router.route('/content/:id', function() {
    let contentEditor = new ContentEditor({
        modelUrl: '/api/content/' + this.id + '?token=' + localStorage.getItem('token')
    });
   
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(contentEditor.$element);
});

// Edit (JSON editor)
Router.route('/content/json/:id', function() {
    let contentEditor = new JSONEditor({
        modelUrl: '/api/content/' + this.id + '?token=' + localStorage.getItem('token')
    });
     
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(contentEditor.$element);
});
