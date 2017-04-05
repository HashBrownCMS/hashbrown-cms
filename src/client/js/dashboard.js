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

// --------------------
// Get current user
// --------------------
apiCall('get', 'user')
.then((user) => {
    User.current = new User(user);

    return apiCall('get', 'server/projects');
})

// --------------------
// Projects
// --------------------
.then((projects) => {
    // Get next project
    function renderNext(i) {
        return apiCall('get', 'server/projects/' + projects[i])
        .then((project) => {
            let projectEditor = new ProjectEditor({
                model: new Project(project)
            });

            $('.dashboard-container .projects .project-list').append(projectEditor.$element);

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

// --------------------
// Users
// --------------------
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
                _.div({class: 'user-info'}, 
                    _.span({class: 'user-icon fa fa-' + (user.isAdmin ? 'black-tie' : 'user')}),
                    _.h4((user.fullName || user.username || user.email || user.id) + (user.id == User.current.id ? ' (you)' : '')),
                    _.p(user.isAdmin ? 'Admin' : 'Editor')
                ),
                _.div({class: 'user-actions'},
                    _.button({class: 'btn btn-primary', title: 'Edit user'},
                        'Edit'
                    ).on('click', () => {
                        let userEditor = new UserEditor({ model: user }); 
                        
                        userEditor.on('save', () => {
                            renderUser(); 
                        });
                    }),
                    _.button({class: 'btn btn-primary', title: 'Remove user'},
                        'Remove'
                    ).on('click', () => {
                        UI.confirmModal(
                            'remove',
                            'Delete user "' + (user.fullName || user.username || user.email || user.id) + '"',
                            'Are you sure you want to remove this user?',
                            () => {
                                apiCall('delete', 'user/' + user.id)
                                .then(() => {
                                    $user.remove(); 
                                })
                                .catch(UI.errorModal);
                            }
                        );
                    })
                )
            );
        };

        $('.dashboard-container .users .user-list').append(
            $user = _.div({class: 'user raised'})
        );

        renderUser();
    }
})

// --------------------
// Restart button
// --------------------
.then(() => {
    if(!User.current.isAdmin) { return Promise.resolve(); }

    $('.btn-restart').click(() => {
        apiCall('post', 'server/restart')
        .then(() => {
            listenForRestart();
        });
    });
})

// --------------------
// Updates
// --------------------
.then(() => {
    if(!User.current.isAdmin) { return; }

    apiCall('get', 'server/update/check')
    .then((update) => {
        if(update.behind) {
            $('.dashboard-container').prepend(
                _.div({class: 'update'},
                    _.p('You are '  + update.amount + ' version' + (update.amount != '1' ? 's' : '') + ' behind ' + update.branch),
                    _.p('Comment: "'  + update.comment + '"'),
                    _.button({class: 'btn btn-primary btn-update-hashbrown'}, 'Update')
                        .click(() => {
                            UI.messageModal('Update', 'HashBrown is updating (this may take a minute)...', false);

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
                                                listenForRestart();
                                            }
                                        }
                                    ]
                                });
                            })
                            .catch(UI.errorModal);
                        })
                )
            );
        }
    });
})
.catch(UI.errorModal);

// --------------------
// Navbar
// --------------------
$('.navbar-main a').click(function() {
    $('.navbar-main a').removeClass('active');
    $(this).addClass('active');
});

// --------------------
// Invite a user
// --------------------
$('.btn-invite-user').click(() => {
    customApiCall('get', '/api/users')
    .then((users) => {
        /**
         * Generate password
         */
        function generatePassword() {
            var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
            for (var i = 0, n = charset.length; i < length; ++i) {
                retVal += charset.charAt(Math.floor(Math.random() * n));
            }
            return retVal;
        }

        /**
         * Event: On submit user changes
         */
        function onSubmit() {
            let username = addUserModal.$element.find('input.username').val();

            // Check if username was email
            let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let isEmail = emailRegex.test(username);

            // Check if en existing user has the same information
            let existingUser = users.filter((user) => {
                return user.username == username || user.email == username;
            })[0];

            // The user was found
            if(existingUser) {
                UI.errorModal(new Error('User "' + username + '" already exists'));
                return;
            }
        
            // An email was provided, send invitation    
            if(isEmail) {
                let modal = UI.confirmModal(
                    'invite',
                    'Add user',
                    'Do you want to invite a new user with email "' + username + '"?',
                    () => {
                        customApiCall('post', '/api/user/invite', {
                            email: username,
                        })
                        .then(() => {
                            UI.messageModal('Invite user', 'Invitation was sent to ' + username);
                        })
                        .catch(errorModal);

                        let $buttons = modal.$element.find('button').attr('disabled', true).addClass('disabled');

                        return false;
                    }
                );

                return;
            }
           
            // User doesn't exist, create it
            let $passwd;

            let modal = UI.confirmModal(
                'create',
                'Add user',
                [
                    _.p('Set password for new user "' + username + '"'),
                    $passwd = _.input({required: true, pattern: '.{6,}', class: 'form-control', type: 'text', value: generatePassword(), placeholder: 'Type new password'})
                ],
                () => {
                    let password = $passwd.val() || '';
                    let scopes = {};

                    apiCall('post', 'user/new', {
                        username: username,
                        password: password,
                        scopes: {}
                    })
                    .then(() => {
                        UI.messageModal('Create user', 'User "' + username + '" was created with password "' + password + '".', () => { location.reload(); });
                    })
                    .catch(errorModal);

                    let $buttons = modal.$element.find('button').attr('disabled', true).addClass('disabled');

                    return false;
                }
            );
        }

        // Renders the modal
        let addUserModal = UI.confirmModal(
            'OK',
            'Add user',
            _.input({class: 'form-control username', placeholder: 'Username or email', type: 'text'})
            .on('change keyup paste propertychange input'),
            onSubmit
        );
    })
    .catch(errorModal);
});

// --------------------
// Create project
// --------------------
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

