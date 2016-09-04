'use strict';

// Root
Router.route('/', function() {
    ViewHelper.get('NavbarMain').showTab('/');

    $.ajax({
        type: 'GET',
        url: '/text/welcome',
        success: (html) => {
            $('.workspace').html(
                _.div({class: 'dashboard-container readme'},
                    html
                )
            );
        }
    });
});

// User
Router.route('/user/', function() {
    ViewHelper.get('NavbarMain').highlightItem('user');

    $('.workspace').html(
        _.div({class: 'dashboard-container user'},
            _.div({class: 'btn btn-danger'},
                'Log out'
            ).click(() => {
                localStorage.clear();

                location = '/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment;
            })
        )
    );
});

// Readme
Router.route('/readme/', function() {
    ViewHelper.get('NavbarMain').highlightItem('readme');

    $.ajax({
        type: 'GET',
        url: '/text/readme',
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
        url: '/text/license',
        success: (html) => {
            $('.workspace').html(
                _.div({class: 'dashboard-container license'},
                    html
                )
            );
        }
    });
});
