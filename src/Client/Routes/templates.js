'use strict';

const TemplateEditor = require('Client/Views/Editors/TemplateEditor');
const RequestHelper = require('Client/Helpers/RequestHelper');

// Templates
Crisp.Router.route('/templates/', function() {
    if(currentUserHasScope('templates')) {
        Crisp.View.get('NavbarMain').showTab('/templates/');

        UI.setEditorSpaceContent(
            [
                _.h1('Templates'),
                _.p('Right click in the Templates pane to create a new Template.'),
                _.p('Click on a Template to edit it.')
            ],
            'text'
        );
    
    } else {
        location.hash = '/';

    }
});

// Edit
Crisp.Router.route('/templates/:type/:id', function() {
    if(currentUserHasScope('templates')) {
        Crisp.View.get('NavbarMain').highlightItem('/templates/', this.type + '/' + this.id);
        
        let templateEditor = new TemplateEditor({
            modelUrl: RequestHelper.environmentUrl('templates/' + this.type + '/' + this.id)
        });

        UI.setEditorSpaceContent(templateEditor.$element);
    
    } else {
        location.hash = '/';

    }
});
