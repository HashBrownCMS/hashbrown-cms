'use strict';

const TemplateEditor = require('Client/Views/Editors/TemplateEditor');
const RequestHelper = require('Client/Helpers/RequestHelper');

// Templates
Crisp.Router.route('/templates/', function() {
    if(currentUserHasScope('templates')) {
        Crisp.View.get('NavbarMain').showTab('/templates/');

        populateWorkspace(
            _.div({class: 'dashboard-container'},
                _.h1('Templates'),
                _.p('Please click on a template to continue')
            ),
            'presentation presentation-center'
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

        populateWorkspace(templateEditor.$element);
    
    } else {
        location.hash = '/';

    }
});
