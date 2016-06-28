'use strict';

// Users
Router.route('/users/', function() {
    ViewHelper.get('NavbarMain').highlightItem('users');

    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Users'),
            _.p('Hi'),
            _.button('Create').click(() => {
                $.ajax({
                    type: 'POST',
                    url: apiUrl('user/new'),
                    data: {
                        username: 'hest',
                        password: 'test'
                    },
                    success: function() {
                        debug.log('wooh!', this);
                    }
                });
            })
        )
    );
});

// About
Router.route('/about/', function() {
    ViewHelper.get('NavbarMain').highlightItem('about');

    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Endomon'),
            _.p('The pluggable CMS')
        )
    );
});
