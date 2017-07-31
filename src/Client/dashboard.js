'use strict';

// Helper functions
require('Client/helpers');

// Libraries
require('crisp-ui');

// Helper shortcuts
window.debug = require('Common/Helpers/DebugHelper');
window.UI = require('Client/Helpers/UIHelper');

// --------------------
// Get current user
// --------------------
apiCall('get', 'user')
.then((user) => {
    const User = require('Common/Models/User');
        
    User.current = new User(user);

    return apiCall('get', 'server/projects');
})

// --------------------
// Projects
// --------------------
.then((projects) => {
    projects = projects || [];

    // Get next project
    function renderNext(i) {
        let project = projects.pop();

        if(!project) {
            return Promise.resolve();
        }

        return apiCall('get', 'server/projects/' + project)
        .then((project) => {
            const Project = require('Common/Models/Project');
            const ProjectEditor = require('Client/Views/Dashboard/ProjectEditor');

            let projectEditor = new ProjectEditor({
                model: new Project(project)
            });

            $('.dashboard-container .projects .project-list').append(projectEditor.$element);

            return renderNext();
        })
        .catch((e) => {
            UI.errorModal(e);

            return renderNext();
        });
    }
    
    return renderNext();
})

// --------------------
// Users
// --------------------
.then(() => {
    if(!currentUserIsAdmin()) { return Promise.resolve(); }

    return apiCall('get', 'users');
})
.then((users) => {
    const UserEditor = require('Client/Views/Editors/UserEditor');
    const User = require('Common/Models/User');

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
    if(!currentUserIsAdmin()) { return Promise.resolve(); }

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
    if(!currentUserIsAdmin()) { return; }

    let $btnUpdate = _.find('.btn-update');

    return apiCall('get', 'server/update/check')
    .then((update) => {
        $btnUpdate.removeClass('working');

        if(update.isBehind) {
            $btnUpdate.attr('title', 'Update is available (' + update.remoteVersion + ')');
           
            $btnUpdate.click(() => {
                UI.messageModal('Update', 'HashBrown is upgrading from ' + update.localVersion + ' to ' + update.remoteVersion + ' (this may take a minute)...', false);

                apiCall('post', 'server/update/start')
                .then(() => {
                    const MessageModal = require('Client/Views/Modals/MessageModal');

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

        } else {
            $btnUpdate.attr('disabled', true);
            $btnUpdate.addClass('disabled');
            $btnUpdate.attr('title', 'HashBrown is up to date');
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
                        .catch(UI.errorModal);

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
                    .catch(UI.errorModal);

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
    .catch(UI.errorModal);
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
                    
    const MessageModal = require('Client/Views/Modals/MessageModal');

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

