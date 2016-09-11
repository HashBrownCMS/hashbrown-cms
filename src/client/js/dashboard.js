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
    function renderNext(i) {
        apiCall('get', 'server/projects/' + projects[i])
        .then((project) => {
            let projectEditor = new ProjectEditor({
                model: new Project(project)
            });

            $('.dashboard-container .workspace .projects .project-list').append(projectEditor.$element);

            if(i < projects.length - 1) {
                renderNext(i + 1);
            }
        })
        .catch(errorModal);
    }
    
    if(projects.length > 0) {
        renderNext(0);
    }
})
.catch(errorModal);

// Set navbar button events
$('.navbar-main a').click(() => {
    $('.navbar-main a').removeClass('active');
    $(this).addClass('active');
});

// Set create new project event
$('.btn-create-project').click(() => {
    function onClickCreate() {
        let project = modal.$element.find('input').val();

        if(project) {
            apiCall('post', 'server/projects/new', {
                project: project
            })
            .then(() => {
                location.reload();
            })
            .catch(errorModal);
        
        } else {
            return false;

        }
    }

    function onChange() {
        let val = $(this).val();
        
        val = (val || '').toLowerCase();
        val = val.replace(/[^a-z_.]/g, '');

        $(this).val(val);
    }

    let modal = new MessageModal({
        model: {
            title: 'Create new project',
            body: _.div({},
                _.p('Please input the new project name'),
                _.input({class: 'form-control', type: 'text', placeholder: 'Project name'})
                .on('change propertychange keyup paste', onChange)
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

// Set update hashbrown event
$('.btn-update-hashbrown').click(() => {
    apiCall('post', 'server/update/start')
    .then(() => {
        messageModal('Success', 'HashBrown was updated successfully');
    })
    .catch(errorModal);
});
