'use strict';

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
