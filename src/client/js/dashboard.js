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
window.UserEditor = require('./views/UserEditor');

// Models
window.Project = require('../../common/models/Project');
window.User = require('../../common/models/User');

// Get current user
apiCall('get', 'user')
.then((user) => {
    User.current = new User(user);

    return apiCall('get', 'server/projects');
})

// Get project list
.then((projects) => {

    // Get next project
    function renderNext(i) {
        return apiCall('get', 'server/projects/' + projects[i])
        .then((project) => {
            let projectEditor = new ProjectEditor({
                model: new Project(project)
            });

            $('.dashboard-container .workspace .projects .project-list').append(projectEditor.$element);

            // If there are more projects to render, render the next one
            if(i < projects.length - 1) {
                return renderNext(i + 1);
            
            // If not, just resolve normally
            } else {
                return Promise.resolve();

            }
        });
    }
    
    // Get next project
    if(projects.length > 0) {
        return renderNext(0);

    // Resolve normally
    } else {
        return Promise.resolve();
    }
})

// Get user list
.then(() => {
    if(!User.current.isAdmin) { return Promise.resolve(); }

    return apiCall('get', 'users');
})
.then((users) => {
    for(let user of users || []) {
        user = new User(user);        

        let $user;
        let $projectList;

        let renderUser = () => {
            _.append($user.empty(),
                _.button({class: 'btn btn-edit'},
                    _.span({class: 'user-icon fa fa-' + (user.isAdmin ? 'black-tie' : 'user')}),
                    _.div({class: 'user-info'}, 
                        _.h4(user.fullName || user.username || user.email || user.id),
                        _.p(user.isAdmin ? 'Admin' : 'Editor')
                    )
                ).on('click', () => {
                    let userEditor = new UserEditor({ model: user }); 
                    
                    userEditor.on('save', () => {
                        renderUser(); 
                    });
                }),
                _.button({class: 'btn btn-remove', title: 'Remove user'},
                    _.span({class: 'fa fa-remove'})
                ).on('click', () => {
                    UI.confirmModal(
                        'remove',
                        'Delete user "' + (user.fullName || user.username || user.id) + '"',
                        'Are you sure you want to remove this user?',
                        () => {
                            apiCall('delete', 'users/' + user.id)
                            .then(() => {
                                $user.remove(); 
                            })
                            .catch(UI.errorModal);
                        }
                    );
                })
            );
        };

        $('.dashboard-container .workspace .users .user-list').append(
            $user = _.div({class: 'user'})
        );

        renderUser();
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

