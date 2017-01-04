'use strict';

// Templates
Router.route('/templates/', function() {
    if(currentUserHasScope('templates')) {
        ViewHelper.get('NavbarMain').showTab('/templates/');

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
Router.route('/templates/:id', function() {
    if(currentUserHasScope('templates')) {
        ViewHelper.get('NavbarMain').highlightItem(this.id);
        
        /*apiCall('get', 'templates/' + this.id)
        .then((template) => {
            let templateEditor = new TemplateEditor({
                model: template
            });

            populateWorkspace(templateEditor.$element);
        })
        .catch(errorModal);*/
    
    } else {
        location.hash = '/';

    }
});
