'use strict';

// Dashboard
Router.route('/media/', function() {
    ViewHelper.get('NavbarMain').showTab('/media/');
    
    populateWorkspace(
        _.div({class: 'dashboard-container'},
            _.h1('Media'),
            _.p('Please click on a media object to proceed')
        ),
        'presentation presentation-center'
    );
});

// Preview
Router.route('/media/:id', function() {
    let mediaViewer = new MediaViewer({
        modelUrl: apiUrl('media/' + this.id)
    });
    
    ViewHelper.get('NavbarMain').highlightItem('/media/', this.id);
    
    populateWorkspace(mediaViewer.$element);
});
