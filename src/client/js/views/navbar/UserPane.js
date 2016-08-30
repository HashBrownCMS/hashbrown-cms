'use strict';

let Pane = require('./Pane');

class UserPane extends Pane {
    /**
     * Event: Click create new User
     */
    static onClickNewUser() {
        let navbar = ViewHelper.get('NavbarMain');

        let onSubmit = () => {
            let username = messageModal.$element.find('input.username').val();
            let password = messageModal.$element.find('input.password').val();

            let usernameValid = username != '';
            let passwordValid = password != '';

            if(usernameValid && passwordValid) {
                let scopes = {};
                scopes[ProjectHelper.currentProject] = [];
                
                let user = {
                    username: username,
                    password: password,
                    scopes: scopes
                };

                apiCall('post', 'users/new', user)
                .then((newUser) => {
                    reloadResource('users')
                    .then(() => {
                        navbar.reload();
                        
                        location.hash = '/users/' + newUser.id;
                    });
                })
                .catch(errorModal);
           
            } else {
                return false;
            
            }
        }

        let messageModal = new MessageModal({
            model: {
                title: 'Create new user',
                body: _.div({},
                    _.input({class: 'form-control username', placeholder: 'Username', type: 'text'}),
                    _.input({class: 'form-control password', placeholder: 'Password', type: 'password'})
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
    }
    
    /**
     * Event: On click remove User
     */
    static onClickRemoveUser() {
        let navbar = ViewHelper.get('NavbarMain');
        let id = $('.context-menu-target-element').data('id');
        let name = $('.context-menu-target-element').data('name');
        
        function onSuccess() {
            reloadResource('users')
            .then(function() {
                navbar.reload();
                
                // Cancel the UserEditor view if it was displaying the deleted user
                if(location.hash == '#/users/' + id) {
                    location.hash = '/users/';
                }
            });
        }

        new MessageModal({
            model: {
                title: 'Delete user',
                body: 'Are you sure you want to remove the user "' + name + '"?'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                    callback: function() {
                    }
                },
                {
                    label: 'OK',
                    class: 'btn-danger',
                    callback: function() {
                        apiCall('delete', 'users/' + id)
                        .then(onSuccess)
                        .catch(navbar.onError);
                    }
                }
            ]
        });
    }

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
                'New user': () => { this.onClickNewUser(); }
            }
        };
    }
}

module.exports = UserPane;
