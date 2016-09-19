'use strict';

// Users
Router.route('/users/', function() {
    if(currentUserHasScope('users')) {
        ViewHelper.get('NavbarMain').showTab('/users/');

        $('.workspace').html(
            _.div({class: 'dashboard-container'},
                _.h1('Users'),
                _.p('Please click on a user to continue')
            )
        );
    
    } else {
        location.hash = '/';

    }
});

// Edit
Router.route('/users/:id', function() {
    if(currentUserHasScope('users')) {
        ViewHelper.get('NavbarMain').highlightItem(this.id);
        
        apiCall('get', 'users/' + this.id)
        .then((user) => {
            let userEditor = new UserEditor({
                model: user
            });

            $('.workspace').html(userEditor.$element);
        })
        .catch(errorModal);
    
    } else {
        location.hash = '/';

    }
});
