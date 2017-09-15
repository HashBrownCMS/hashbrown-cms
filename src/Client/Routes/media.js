'use strict';

const MediaViewer = require('Client/Views/Editors/MediaViewer');
const RequestHelper = require('Client/Helpers/RequestHelper');

// Dashboard
Crisp.Router.route('/media/', function() {
    Crisp.View.get('NavbarMain').showTab('/media/');
    
    populateWorkspace(
        _.div({class: 'dashboard-container'},
            _.h1('Media'),
            _.p('Please click on a media object to proceed')
        ),
        'presentation presentation-center'
    );
});

// Preview
Crisp.Router.route('/media/:id', function() {
    let mediaViewer = new MediaViewer({
        modelUrl: RequestHelper.environmentUrl('media/' + this.id)
    });
    
    Crisp.View.get('NavbarMain').highlightItem('/media/', this.id);
    
    populateWorkspace(mediaViewer.$element);
});
