'use strict';

onReady('navbar', function() {
    ViewHelper.get('NavbarMain').renderPane({
        label: 'GitHub',
        route: '/github/',
        icon: 'github',
        items: [
            {
                name: 'Issues',
                path: 'issues',
                icon: 'exclamation-circle'
            },
            {
                name: 'Wiki',
                path: 'wiki',
                icon: 'book'
            }
        ]
    });
});

Router.route('/github/', function() {
    ViewHelper.get('NavbarMain').showTab('/github/');

    $('.workspace').html(
        _.div({class: 'dashboard-container'}, [
            _.h1('GitHub dashboard'),
            _.p('Please click on a feature to proceed')
        ])
    );
});

Router.route('/github/issues/', function() {
    ViewHelper.get('NavbarMain').highlightItem('issues');
});

Router.route('/github/wiki/', function() {
    ViewHelper.get('NavbarMain').highlightItem('wiki');
});
