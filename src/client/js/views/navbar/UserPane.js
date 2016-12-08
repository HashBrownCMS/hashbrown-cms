'use strict';

let Pane = require('./Pane');

class UserPane extends Pane {
    /**
     * Event: Click add User
     */
    static onClickAddUser() {
        let navbar = ViewHelper.get('NavbarMain');

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

                let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                let isEmail = emailRegex.test(username);

                let user = users.filter((user) => {
                    return user.username == username || user.email == username;
                })[0];

                // The user was found
                if(user) {
                    if(!user.scopes) {
                        user.scopes = [];
                    }

                    // The user already has scopes in this project
                    if(user.scopes[ProjectHelper.currentProject]) {
                        UI.messageModal('Add user', 'The user  "' + username + '" is already part of this project (' + ProjectHelper.currentProject + ')');
                        return;
                    }

                    // Set empty scope array for this project
                    user.scopes[ProjectHelper.currentProject] = [];

                    // Post changes to user
                    apiCall('post', 'users/' + user.id, user)
                    .then(() => {
                        return reloadResource('users');
                    })
                    .then(() => {
                        let navbar = ViewHelper.get('NavbarMain');
                        
                        navbar.reload();

                        addUserModal.hide();

                        location.hash = '/users/' + user.id;
                    })
                    .catch(errorModal);
            
                // An email was provided, send invitation    
                } else if(isEmail) {
                    let modal = new MessageModal({
                        model: {
                            title: 'Add user',
                            body: 'Do you want to invite a new user with email "' + username + '"?'
                        },
                        buttons: [
                            {
                                label: 'Cancel',
                                class: 'btn-default'
                            },
                            {
                                label: 'Invite',
                                class: 'btn-primary',
                                callback: () => {
                                    customApiCall('post', '/api/user/invite', {
                                        email: username,
                                        project: ProjectHelper.currentProject
                                    })
                                    .then(() => {
                                        UI.messageModal('Invite user', 'Invitation was sent to ' + username);
                                    })
                                    .catch(errorModal);

                                    let $buttons = modal.$element.find('button').attr('disabled', true).addClass('disabled');

                                    return false;
                                }
                            }
                        ]
                    });
               
                // User doesn't exist, create it
                } else {
                    let $passwd;

                    let modal = new MessageModal({
                        model: {
                            title: 'Add user',
                            body: _.div({},
                                _.p('Set password for new user "' + username + '"'),
                                $passwd = _.input({required: true, pattern: '.{6,}', class: 'form-control', type: 'text', value: generatePassword(), placeholder: 'Type new password'})
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
                                callback: () => {
                                    let password = $passwd.val() || '';
                                    let scopes = {};
                                    scopes[ProjectHelper.currentProject] = [];

                                    apiCall('post', 'users/new', {
                                        username: username,
                                        password: password,
                                        scopes: scopes
                                    })
                                    .then(() => {
                                        UI.messageModal('Create user', 'User "' + username + '" was created with password "' + password + '".', () => { location.reload(); });
                                    })
                                    .catch(errorModal);

                                    let $buttons = modal.$element.find('button').attr('disabled', true).addClass('disabled');

                                    return false;
                                }
                            }
                        ]
                    });
                
                }
            }

            /**
             * Updates user suggestions
             */
            function updateSuggestions() {
                let input = $(this).val();

                let $dropdown = addUserModal.$element.find('.dropdown');
                let $list = addUserModal.$element.find('.dropdown-menu').empty();

                // Only consider inputs equal to or more than 2 characters
                if(input.length > 1) {
                    // Filter search results
                    let results = users.filter((user) => {
                        if(user.username.toLowerCase().indexOf(input) > -1) {
                            return true;
                        }

                        if((user.fullName || '').toLowerCase().indexOf(input) > -1) {
                            return true;
                        }

                        return false;
                    });

                    // Only set dropdown to open if results are more than 0
                    $dropdown.toggleClass('open', results.length > 0);

                    // Render results
                    _.append($list,
                        _.each(results, (i, user) => {
                            return _.li(
                                _.a({href: '#'}, user.username + (user.fullName ? ' (' + user.fullName + ')' : ''))
                                    .click((e) => {
                                        e.preventDefault();

                                        $(this).val(user.username);

                                        $dropdown.toggleClass('open', false);
                                    })
                            );
                        })
                    );
                }
            }

            // Renders the modal
            let addUserModal = new MessageModal({
                model: {
                    title: 'Add user to project',
                    body: _.div({class: 'dropdown typeahead'},
                        _.input({class: 'form-control username', placeholder: 'Username', type: 'text'})
                            .on('change keyup paste propertychange input', updateSuggestions),
                        _.ul({class: 'dropdown-menu'})
                    )
                },
                buttons: [
                    {
                        label: 'Cancel',
                        class: 'btn-default'
                    },
                    {
                        label: 'OK',
                        class: 'btn-primary',
                        callback: onSubmit
                    }
                ]
            });
        })
        .catch(errorModal);
    }
        
    /**
     * Event: On click remove User
     */
    static onClickRemoveUser() {
        let navbar = ViewHelper.get('NavbarMain');
        let id = $('.context-menu-target-element').data('id');
        let name = $('.context-menu-target-element').data('name');
        
        function onSuccess() {
            return reloadResource('users')
            .then(function() {
                navbar.reload();
                
                // Cancel the UserEditor view if it was displaying the deleted user
                if(location.hash == '#/users/' + id) {
                    location.hash = '/users/';
                }
            });
        }

        function onClickOK() {
            apiCall('delete', 'users/' + id)
            .then(onSuccess)
            .catch(navbar.onError);
        }

        new MessageModal({
            model: {
                title: 'Remove user',
                body: 'Are you sure you want to remove the user "' + name + '" from this project (' + ProjectHelper.currentProject + ')?'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                    callback: function() {
                    }
                },
                {
                    label: 'Remove',
                    class: 'btn-danger',
                    callback: onClickOK
                }
            ]
        });
    }

    /**
     * Gets the render settings
     *
     * @returns {Object} Settings
     */
    static getRenderSettings() {
        return {
            label: 'Users',
            route: '/users/',
            icon: 'user',
            items: resources.users,

            // Item context menu
            itemContextMenu: {
                'This user': '---',
                'Copy id': () => { this.onClickCopyItemId(); },
                'Remove': () => { this.onClickRemoveUser(); }
            },

            // General context menu
            paneContextMenu: {
                'User': '---',
                'Add user': () => { this.onClickAddUser(); }
            }
        };
    }
}

module.exports = UserPane;
