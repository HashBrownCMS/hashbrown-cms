'use strict';

const MediaViewer = require('Client/Views/Editors/MediaViewer');
const RequestHelper = require('Client/Helpers/RequestHelper');

// Dashboard
Crisp.Router.route('/media/', function() {
    Crisp.View.get('NavbarMain').showTab('/media/');
    
    UI.setEditorSpaceContent(
        [
            _.h1('Media'),
            _.p('Right click in the Media pane to create a new Media.'),
            _.p('Click on a Media node to edit it.')
        ],
        'text'
    );
});

// Preview
Crisp.Router.route('/media/:id', function() {
    let mediaViewer = new MediaViewer({
        modelUrl: RequestHelper.environmentUrl('media/' + this.id)
    });
    
    Crisp.View.get('NavbarMain').highlightItem('/media/', this.id);
    
    UI.setEditorSpaceContent(mediaViewer.$element);
});
