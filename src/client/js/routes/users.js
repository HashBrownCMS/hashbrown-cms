'use strict';

// Users
Router.route('/users/', function() {
    if(currentUserHasScope('users')) {
        ViewHelper.get('NavbarMain').showTab('/users/');

        populateWorkspace(
            _.div({class: 'dashboard-container'},
                _.h1('Users'),
                _.p('Please click on a user to continue')
            ),
            'presentation presentation-center'
        );
    
    } else {
        location.hash = '/';

    }
});

// Edit
Router.route('/users/:id', function() {
    if(User.current.id == this.id || currentUserHasScope('users')) {
        ViewHelper.get('NavbarMain').highlightItem(this.id);
        
        apiCall('get', 'users/' + this.id)
        .then((user) => {
            let userEditor = new UserEditor({
                model: user
            });

            populateWorkspace(userEditor.$element);
        })
        .catch(errorModal);
    
    } else {
        location.hash = '/';

    }
});
