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

// Readme
Router.route('/readme/', function() {
    ViewHelper.get('NavbarMain').highlightItem('readme');

    $.ajax({
        type: 'GET',
        url: '/readme',
        success: (html) => {
            $('.workspace').html(
                _.div({class: 'dashboard-container readme'},
                    html
                )
            );
        }
    });
});

// License
Router.route('/license/', function() {
    ViewHelper.get('NavbarMain').highlightItem('license');

    $.ajax({
        type: 'GET',
        url: '/license',
        success: (html) => {
            $('.workspace').html(
                _.div({class: 'dashboard-container license'},
                    html
                )
            );
        }
    });
});
