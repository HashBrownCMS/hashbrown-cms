'use strict';

// Users
Router.route('/users/', function() {
    ViewHelper.get('NavbarMain').showTab('/users/');

    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Users'),
            _.p('Please click on a user to continue')
        )
    );
});

// Edit
Router.route('/users/:id', function() {
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    apiCall('get', 'users/' + this.id)
    .then((user) => {
        let userEditor = new UserEditor({
            model: user
        });

        $('.workspace').html(userEditor.$element);
    })
    .catch(errorModal);
});
