'use strict';

/**
 * Initialises the project views
 */
async function initProjects() {
    // Add project
    $('.page--dashboard__projects__add').click(onClickAddProject);

    // Fetch projects
    let projectIds = await HashBrown.Helpers.RequestHelper.request('get', 'server/projects?ids=true');
   
    $('.page--dashboard__projects__list').empty();

    for(let projectId of projectIds || []) {
        let projectEditor = new HashBrown.Views.Dashboard.ProjectEditor({
            modelId: projectId
        });

        $('.page--dashboard__projects__list').prepend(projectEditor.$element);
    }
}

/**
 * Initialises the user views
 */
async function initUsers() {
    if(!currentUserIsAdmin()) { return; }

    // Invite user
    $('.page--dashboard__users__add').click(onClickInviteUser);

    // Get users
    let users = await HashBrown.Helpers.RequestHelper.request('get', 'users');
    
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
                                if(user.id === HashBrown.Context.user.id) { return UI.errorModal(new Error('You cannot delete yourself')); }
                                
                                UI.confirmModal(
                                    'remove',
                                    'Delete user "' + (user.fullName || user.username || user.email || user.id) + '"',
                                    'Are you sure you want to remove this user?',
                                    async () => {
                                        await HashBrown.Helpers.ResourceHelper.remove('users', user.id);

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
 * Init server view
 */
async function initServer() {
    if(!currentUserIsAdmin() || !$btnUpdate) { return; }

    // Restart server
    $('.page--dashboard__restart').click(onClickRestart);
    
    // Check for updates
    let $btnUpdate = _.find('.page--dashboard__update');
    
    let update = await HashBrown.Helpers.RequestHelper.request('get', 'server/update/check');
    $btnUpdate.removeClass('working');

    if(update.isBehind) {
        $btnUpdate.attr('title', 'Update is available (' + update.remoteVersion + ')');

        $btnUpdate.click(async () => {
            UI.messageModal('Update', 'HashBrown is upgrading from ' + update.localVersion + ' to ' + update.remoteVersion + ' (this may take a minute)...', false);

            await HashBrown.Helpers.RequestHelper.request('post', 'server/update/start');
            
            UI.messageModal('Success', 'HashBrown is restarting...', false);

            HashBrown.Helpers.RequestHelper.listenForRestart();
        })

    } else {
        $btnUpdate.attr('disabled', true);
        $btnUpdate.addClass('disabled');
        $btnUpdate.attr('title', 'HashBrown is up to date');
    }
}


/**
 * Event: Click restart
 */
async function onClickRestart() {
    if(!currentUserIsAdmin()) { return; }
    
    await HashBrown.Helpers.RequestHelper.request('post', 'server/restart');

    HashBrown.Helpers.RequestHelper.listenForRestart();
}

/**
 * Event: Click invite user
 */
async function onClickInviteUser() {
    let users = await HashBrown.Helpers.RequestHelper.customRequest('get', '/api/users');

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
                async () => {
                    let token = await HashBrown.Helpers.RequestHelper.customRequest('post', '/api/users/invite', { email: username });

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
                let scopes = {};

                UI.messageModal('Creating user', 'Creating user "' + username + '"...');

                await HashBrown.Helpers.ResourceHelper.new('users', '', {
                    username: username,
                    password: password,
                    scopes: {}
                });

                UI.messageModal('Create user', 'User "' + username + '" was created with password "' + password + '".', () => { location.reload(); });
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
}

/**
 * Event: Click create project
 */
async function onClickAddProject() {
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
                onClick: async (e) => {
                    let name = modal.$element.find('input').val();

                    if(name) {
                        await HashBrown.Helpers.RequestHelper.request('post', 'server/projects/new', { name: name });
                            
                        location.reload();
                    }

                    return false;
                }
            }
        ]
    });
}

/**
 * Event: Document ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check for required submodules
    submoduleCheck();

    // Libraries
    window._ = Crisp.Elements;

    // Helper shortcuts
    window.debug = HashBrown.Helpers.DebugHelper;
    window.UI = HashBrown.Helpers.UIHelper;

    // Error handling
    window.onerror = UI.errorModal;

    // Init current user
    HashBrown.Context.user = new HashBrown.Models.User(HashBrown.Context.user);

    // Run init functions
    initProjects();
    initUsers();
    initServer();
});
