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

        let projectIds = await HashBrown.Service.RequestService.request('get', 'server/projects?ids=true');
       
        for(let projectId of projectIds || []) {
            let projectEditor = new HashBrown.Entity.View.ListItem.Project({
                modelId: projectId
            });

            document.querySelector('.page--dashboard__projects__list').appendChild(projectEditor.element);
        }
    }
}

/**
 * Initialises the user views
 */
async function initUsers() {
    if(!HashBrown.Context.user.isAdmin) { return; }

    // Add user
    let userAddButton = document.querySelector('.page--dashboard__users__add');

    if(userAddButton) {
        userAddButton.onclick = onClickAddUser;
    }

    // Get users
    let userList = document.querySelector('.page--dashboard__users__list');

    if(userList) {
        userList.innerHTML = '';

        let users = await HashBrown.Service.RequestService.request('get', 'users');
        
        for(let user of users || []) {
            userList.appendChild(
                new HashBrown.Entity.View.ListItem.User({
                    modelId: user.id
                }).element
            );
        }
    }
}

/**
 * Initialises the current user menu
 */
function initUser() {
    document.querySelector('header').appendChild(
        new HashBrown.Entity.View.Navigation.Session().element
    );
}

/**
 * Event: Click add user
 */
async function onClickAddUser() {
    new HashBrown.Entity.View.Modal.CreateUser()
    .on('change', initUsers);
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
    initUser();

    // Check for updates
    updateCheck();
});
