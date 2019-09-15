'use strict';

/**
 * Initialises the project views
 */
async function initProjects() {
    // Add project
    document.querySelector('.page--dashboard__projects__add').onclick = onClickAddProject;

    // Fetch projects
    document.querySelector('.page--dashboard__projects__list').innerHTML = '';

    let projectIds = await HashBrown.Service.RequestService.request('get', 'server/projects?ids=true');
   
    for(let projectId of projectIds || []) {
        let projectEditor = new HashBrown.Entity.View.ListItem.Project({
            modelId: projectId
        });

        document.querySelector('.page--dashboard__projects__list').appendChild(projectEditor.element);
    }
}

/**
 * Initialises the user views
 */
async function initUsers() {
    if(!HashBrown.Context.user.isAdmin) { return; }

    // Invite user
    $('.page--dashboard__users__add').click(onClickInviteUser);

    // Get users
    let users = await HashBrown.Service.RequestService.request('get', 'users');
    
    for(let user of users || []) {
        user = new HashBrown.Entity.Resource.User(user);

        let $user;
        let $projectList;

        let renderUser = () => {
            _.append($user.empty(),
                _.div({class: 'page--dashboard__user__body'},
                    new HashBrown.View.Widget.Dropdown({
                        icon: 'ellipsis-v',
                        reverseKeys: true,
                        options: {
                            'Edit': () => { 
                                let userEditor = new HashBrown.View.Editor.UserEditor({ model: user });

                                userEditor.on('save', () => {
                                    renderUser();
                                });
                            },
                            'Delete': () => {
                                if(user.id === HashBrown.Context.user.id) { return UI.errorModal(new Error('You cannot delete yourself')); }
                                
                                UI.confirmModal(
                                    'remove',
                                    'Delete user "' + (user.fullName || user.username || user.email || user.id) + '"',
                                    'Are you sure you want to remove this user?',
                                    async () => {
                                        await HashBrown.Service.ResourceService.remove('users', user.id);

                                        $user.remove();
                                    }
                                );
                            },
                        }
                    }).$element.addClass('page--dashboard__user__menu'),
                    _.h3({class: 'page--dashboard__user__name'},
                        (user.fullName || user.username || user.email || user.id) + (user.id == HashBrown.Context.user.id ? ' (you)' : '')
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
}

/**
 * Event: Click invite user
 */
async function onClickInviteUser() {
    let users = await HashBrown.Service.RequestService.customRequest('get', '/api/users');

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
        let currentUsername = HashBrown.Context.user.fullName || HashBrown.Context.user.username;

        // Check if username was email
        let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isEmail = emailRegex.test(username);

        // Check if an existing user has the same information
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
                async () => {
                    let token = await HashBrown.Service.RequestService.customRequest('post', '/api/users/invite', { email: username });

                    let subject = 'Invitation to HashBrown';
                    let url = location.protocol + '//' + location.host + '/login?inviteToken=' + token;
                    let body = 'You have been invited by ' + currentUsername + ' to join a HashBrown instance.%0D%0APlease go to this URL to activate your account: %0D%0A' + url;
                    let href = 'mailto:' + username + '?subject=' + subject + '&body=' + body;

                    location.href = href;

                    UI.messageModal('Created invitation for "' + username + '"', 'Make sure to send the new user this link: <a href="' + url + '">' + url + '</a>', () => {
                        location.reload();
                    });

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
            async () => {
                let password = $passwd.val() || '';
                let newUser = {
                    username: username,
                    password: password
                };

                modal.setLoading(true);

                await HashBrown.Service.ResourceService.new(HashBrown.Entity.Resource.User, 'users', '', newUser);

                modal.close();

                UI.messageModal('Create user', 'User "' + username + '" was created with password "' + password + '".', () => { location.reload(); });
            }
        );
    }

    // Renders the modal
    let addUserModal = UI.messageModal(
        'Add user',
        _.div({class: 'widget-group'},
            _.div({class: 'widget widget--label'}, 'Username or email'),
            new HashBrown.View.Widget.Input({
                placeholder: 'Input username or email'
            }).$element
        ),
        onSubmit
    );
}

/**
 * Event: Click create project
 */
async function onClickAddProject() {
    new HashBrown.Entity.View.Modal.CreateProject()
    .on('change', initProjects);
}

/**
 * Event: Document ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check for required submodules
    submoduleCheck();

    // Libraries
    window._ = Crisp.Elements;

    // Service shortcuts
    window.debug = HashBrown.Service.DebugService;
    window.UI = HashBrown.Service.UIService;

    // Error handling
    window.onerror = UI.errorModal;

    // Init current user
    HashBrown.Context.user = new HashBrown.Entity.Resource.User(HashBrown.Context.user);

    // Run init functions
    initProjects();
    initUsers();

    // Check for updates
    updateCheck();
});
