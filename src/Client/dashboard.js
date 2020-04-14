'use strict';

/**
 * Initialises the project views
 */
async function initProjects() {
    // Add project
    let projectAddButton = document.querySelector('.page--dashboard__projects__add');

    if(projectAddButton) {
        projectAddButton.onclick = onClickAddProject;
    }

    // Fetch projects
    let projectList = document.querySelector('.page--dashboard__projects__list');

    if(projectList) {
        projectList.innerHTML = '';

        let projectIds = await HashBrown.Service.RequestService.request('get', 'projects/ids');
       
        for(let projectId of projectIds || []) {
            let projectEditor = HashBrown.Entity.View.ListItem.Project.new({
                modelId: projectId
            });

            document.querySelector('.page--dashboard__projects__list').appendChild(projectEditor.element);
        }

        if(projectAddButton) {
            projectList.appendChild(projectAddButton);
        }
    }
}

/**
 * Initialises the user views
 */
async function initUsers() {
    if(!HashBrown.Client.context.user.isAdmin) { return; }

    // Add user
    let userAddButton = document.querySelector('.page--dashboard__users__add');

    if(userAddButton) {
        userAddButton.onclick = onClickAddUser;
    }

    // Get users
    let userList = document.querySelector('.page--dashboard__users__list');

    if(userList) {
        userList.innerHTML = '';

        let users = await HashBrown.Entity.User.list();
        
        for(let user of users || []) {
            userList.appendChild(
                HashBrown.Entity.View.ListItem.User.new({
                    modelId: user.id
                }).element
            );
        }

        if(userAddButton) {
            userList.appendChild(userAddButton);
        }
    }
}

/**
 * Initialises the current user menu
 */
function initUser() {
    document.querySelector('header').appendChild(
        HashBrown.Entity.View.Navigation.Session.new().element
    );
}

/**
 * Event: Click add user
 */
async function onClickAddUser() {
    HashBrown.Entity.View.Modal.CreateUser.new()
    .on('change', initUsers);
}

/**
 * Event: Click create project
 */
async function onClickAddProject() {
    HashBrown.Entity.View.Modal.CreateProject.new()
    .on('change', initProjects);
}

/**
 * Event: Document ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Service shortcuts
    window.debug = HashBrown.Service.DebugService;
    window.UI = HashBrown.Service.UIService;

    // Error handling
    window.onerror = (e) => { UI.error(e) };

    // Init context
    HashBrown.Client.context = HashBrown.Entity.Context.new(HashBrown.Client.context);

    // Run init functions
    initProjects();
    initUsers();
    initUser();

    // Check for updates
    updateCheck();
});
