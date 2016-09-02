'use strict';

// Helper functions
require('./helpers');

// Get package file
window.app = require('../../../package.json');

// Views
window.ProjectEditor = require('./views/dashboard/ProjectEditor');

// Models
window.Project = require('../../common/models/Project');

// Get projects
apiCall('get', 'server/projects')
.then((projects) => {
    for(let i in projects) {
        apiCall('get', 'server/projects/' + projects[i])
        .then((project) => {
            let projectEditor = new ProjectEditor({
                model: new Project(project)
            });

            $('.dashboard-container .workspace .projects').append(projectEditor.$element);
        })
        .catch(errorModal);
    }
})
.catch(errorModal);

// Set navbar button events
$('.navbar-main a').click(function() {
    $('.navbar-main a').removeClass('active');
    $(this).addClass('active');
});

// Set create new project event
$('.btn-create-project').click(function() {
    function onClickCreate() {
        let project = modal.$element.find('input').val();

        // TODO: Create project 
    }

    let modal = new MessageModal({
        model: {
            title: 'Create new project',
            body: _.div({},
                _.p('Please input the new project name'),
                _.input({class: 'form-control', type: 'text', placeholder: 'Project name'})
            )
        },
        buttons: [
            {
                label: 'Cancel',
                class: 'btn-default'
            },
            {
                label: 'Create',
                class: 'btn-primary',
                callback: onClickCreate
            }
        ]
    });
});
