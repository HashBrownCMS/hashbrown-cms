'use strict';

window._crypto = null;

// Helper functions
require('./helpers');

// Get package file
window.app = require('../../../package.json');

// Views
window.ProjectEditor = require('./views/dashboard/ProjectEditor');
window.BackupEditor = require('./views/dashboard/BackupEditor');
window.MigrationEditor = require('./views/dashboard/MigrationEditor');
window.InfoEditor = require('./views/dashboard/InfoEditor');
window.LanguageEditor = require('./views/dashboard/LanguageEditor');

// Models
window.Project = require('../../common/models/Project');

// Get projects
apiCall('get', 'server/projects')
.then((projects) => {
    function renderNext(i) {
        return apiCall('get', 'server/projects/' + projects[i])
        .then((project) => {
            let projectEditor = new ProjectEditor({
                model: new Project(project)
            });

            $('.dashboard-container .workspace .projects .project-list').append(projectEditor.$element);

            if(i < projects.length - 1) {
                return renderNext(i + 1);
            
            } else {
                return Promise.resolve();

            }
        })
        .catch(UI.errorModal);
    }
    
    if(projects.length > 0) {
        return renderNext(0);
    
    } else {
        return Promise.resolve();
    }
})
.catch(UI.errorModal);

// Set navbar button events
$('.navbar-main a').click(function() {
    $('.navbar-main a').removeClass('active');
    $(this).addClass('active');
});

// Set create new project event
$('.btn-create-project').click(() => {
    function onClickCreate() {
        let name = modal.$element.find('input').val();

        if(name) {
            apiCall('post', 'server/projects/new', { name: name })
            .then(() => {
                location.reload();
            })
            .catch(UI.errorModal);
        
        } else {
            return false;

        }
    }

    let modal = new MessageModal({
        model: {
            title: 'Create new project',
            body: [
                _.input({class: 'form-control', type: 'text', placeholder: 'Project name'})
            ]
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

// Check for updates
apiCall('get', 'server/update/check')
.then((update) => {
    if(update.behind) {
        $('.workspace').prepend(
            _.section({},
                _.div({class: 'update'},
                    _.p('You are '  + update.amount + ' version' + (update.amount != '1' ? 's' : '') + ' behind ' + update.branch),
                    _.button({class: 'btn btn-primary btn-update-hashbrown'}, 'Update')
                        .click(() => {
                            UI.messageModal('Update', 'HashBrown is updating...', false);

                            apiCall('post', 'server/update/start')
                            .then(() => {
                                new MessageModal({
                                    model: {
                                        title: 'Success',
                                        body: 'HashBrown was updated successfully'
                                    },
                                    buttons: [
                                        {
                                            label: 'Cool!',
                                            class: 'btn-primary',
                                            callback: () => {
                                                UI.messageModal('Success', 'HashBrown is restarting...', false);

                                                function poke() {
                                                    $.ajax({
                                                        type: 'get',
                                                        url: '/',
                                                        success: () => {
                                                            location.reload();
                                                        },
                                                        error: () => {
                                                            poke();
                                                        }
                                                    });
                                                }

                                                poke();
                                            }
                                        }
                                    ]
                                });
                            })
                            .catch(UI.errorModal);
                        })
                )
            )
        );
    }
});

