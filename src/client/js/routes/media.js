'use strict';

// Dashboard
Router.route('/media/', function() {
    ViewHelper.get('NavbarMain').showTab('/media/');
    
    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Media dashboard'),
            _.p('Please click on a media object to proceed')
        )
    );
});

// Preview
Router.route('/media/:id', function() {
    let mediaViewer = new MediaViewer({
        modelUrl: apiUrl('media/' + this.id)
    });
    
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(mediaViewer.$element);
});
