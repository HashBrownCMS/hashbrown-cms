'use strict';

document.addEventListener('DOMContentLoaded', () => {
    submoduleCheck();

    // Libraries
    window._ = Crisp.Elements;
    window.Promise = require('bluebird');

    // Helper shortcuts
    window.debug = HashBrown.Helpers.DebugHelper;
    window.UI = HashBrown.Helpers.UIHelper;

    // Error handling
    window.onerror = UI.errorModal;

    // Get current user
    HashBrown.Helpers.RequestHelper.request('get', 'user')
    .then((user) => {
        HashBrown.Models.User.current = new HashBrown.Models.User(user);

        return HashBrown.Helpers.RequestHelper.request('get', 'server/projects?ids=true');
    })

    // Get projects
    .then((projects) => {
        projects = projects || [];

        for(let projectId of projects) {
            let projectEditor = new HashBrown.Views.Dashboard.ProjectEditor({
                modelUrl: '/api/server/projects/' + projectId
            });

            $('.page--dashboard__projects__list').prepend(projectEditor.$element);
        }
    })

    // Get users
    .then(() => {
        if(!currentUserIsAdmin()) { return Promise.resolve(); }

        return HashBrown.Helpers.RequestHelper.request('get', 'users');
    })
    .then((users) => {
        for(let user of users || []) {
            user = new HashBrown.Models.User(user);

            let $user;
            let $projectList;

            let renderUser = () => {
                _.append($user.empty(),
                    _.div({class: 'page--dashboard__user__body'},
                        new HashBrown.Views.Widgets.Dropdown({
                            icon: 'ellipsis-v',
                            reverseKeys: true,
                            options: {
                                'Edit': () => { 
                                    let userEditor = new HashBrown.Views.Editors.UserEditor({ model: user });

                                    userEditor.on('save', () => {
                                        renderUser();
                                    });
                                },
                                'Delete': () => {
                                    if(user.id === HashBrown.Models.User.current.id) { return UI.errorModal(new Error('You cannot delete yourself')); }
                                    
                                    UI.confirmModal(
                                        'remove',
                                        'Delete user "' + (user.fullName || user.username || user.email || user.id) + '"',
                                        'Are you sure you want to remove this user?',
                                        () => {
                                            HashBrown.Helpers.RequestHelper.request('delete', 'user/' + user.id)
                                            .then(() => {
                                                $user.remove();
                                            })
                                            .catch(UI.errorModal);
                                        }
                                    );
                                },
                            }
                        }).$element.addClass('page--dashboard__user__menu'),
                        _.h4({class: 'page--dashboard__user__name'},
                            (user.fullName || user.username || user.email || user.id) + (user.id == HashBrown.Models.User.current.id ? ' (you)' : '')
                        ),
                        _.div({class: 'page--dashboard__user__type'},
                            _.if(user.isAdmin,
                                _.span({class: 'page--dashboard__user__type__icon fa fa-black-tie'}),
                                'Admin'
                            ),
                            _.if(!user.isAdmin,
                                _.span({class: 'page--dashboard__user__type__icon fa fa-user'}),
                                'Editor'
                            )
                        )
                    )
                );
            };

            $('.page--dashboard__users__list').append(
                $user = _.div({class: 'page--dashboard__user'})
            );

            renderUser();
        }
    })

    // Check for updates
    .then(() => {
        let $btnUpdate = _.find('.page--dashboard__update');
        
        if(!currentUserIsAdmin() || !$btnUpdate) { return; }

        return HashBrown.Helpers.RequestHelper.request('get', 'server/update/check')
        .then((update) => {
            $btnUpdate.removeClass('working');

            if(update.isBehind) {
                $btnUpdate.attr('title', 'Update is available (' + update.remoteVersion + ')');

                $btnUpdate.click(() => {
                    UI.messageModal('Update', 'HashBrown is upgrading from ' + update.localVersion + ' to ' + update.remoteVersion + ' (this may take a minute)...', false);

                    HashBrown.Helpers.RequestHelper.request('post', 'server/update/start')
                    .then(() => {
                        UI.messageModal('Success', 'HashBrown is restarting...', false);

                        HashBrown.Helpers.RequestHelper.listenForRestart();
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

    /**
     * Event: Click restart
     */
    $('.page--dashboard__restart').click(() => {
        if(!currentUserIsAdmin()) { return; }
        
        HashBrown.Helpers.RequestHelper.request('post', 'server/restart')
        .then(() => {
            HashBrown.Helpers.RequestHelper.listenForRestart();
        });
    });

    /**
     * Event: Click invite user
     */
    $('.page--dashboard__users__add').click(() => {
        HashBrown.Helpers.RequestHelper.customRequest('get', '/api/users')
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
                let username = addUserModal.$element.find('input').val();
                let currentUsername = HashBrown.Models.User.current.fullName || HashBrown.Models.User.current.username;

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
                            HashBrown.Helpers.RequestHelper.customRequest('post', '/api/user/invite', {
                                email: username,
                            })
                            .then((token) => {
                                let subject = 'Invitation to HashBrown';
                                let url = location.protocol + '//' + location.host + '/login?inviteToken=' + token;
                                let body = 'You have been invited by ' + currentUsername + ' to join a HashBrown instance.%0D%0APlease go to this URL to activate your account: %0D%0A' + url;
                                let href = 'mailto:' + username + '?subject=' + subject + '&body=' + body;

                                location.href = href;

                                UI.messageModal('Created invitation for "' + username + '"', 'Make sure to send the new user this link: <a href="' + url + '">' + url + '</a>', () => {
                                    location.reload();
                                });
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

                let modal = UI.messageModal(
                    'Add user',
                    _.div({class: 'widget-group'},
                        _.label({class: 'widget widget--label'}, 'Password for new user "' + username + '"'),
                        $passwd = _.input({required: true, pattern: '.{6,}', class: 'widget widget--input text', type: 'text', value: generatePassword(), placeholder: 'Type new password'})
                    ),
                    () => {
                        let password = $passwd.val() || '';
                        let scopes = {};

                        UI.messageModal('Creating user', 'Creating user "' + username + '"...');

                        HashBrown.Helpers.RequestHelper.request('post', 'user/new', {
                            username: username,
                            password: password,
                            scopes: {}
                        })
                        .then(() => {
                            UI.messageModal('Create user', 'User "' + username + '" was created with password "' + password + '".', () => { location.reload(); });
                        })
                        .catch(UI.errorModal);
                    }
                );
            }

            // Renders the modal
            let addUserModal = UI.messageModal(
                'Add user',
                _.div({class: 'widget-group'},
                    _.div({class: 'widget widget--label'}, 'Username or email'),
                    new HashBrown.Views.Widgets.Input({
                        placeholder: 'Input username or email'
                    }).$element
                ),
                onSubmit
            );
        })
        .catch(UI.errorModal);
    });

    /**
     * Event: Click create project
     */
    $('.page--dashboard__projects__add').click(() => {
        let modal = new HashBrown.Views.Modals.Modal({
            title: 'Create new project',
            body: _.div({class: 'widget-group'},
                _.label({class: 'widget widget--label'}, 'Project name'),
                new HashBrown.Views.Widgets.Input({
                    placeholder: 'example.com'
                }).$element
            ),
            actions: [
                {
                    label: 'Create',
                    onClick: (e) => {
                        let name = modal.$element.find('input').val();

                        if(name) {
                            HashBrown.Helpers.RequestHelper.request('post', 'server/projects/new', { name: name })
                            .then(() => {
                                location.reload();
                            })
                            .catch(UI.errorModal);
                        }

                        return false;
                    }
                }
            ]
        });
    });
});
