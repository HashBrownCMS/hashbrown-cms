'use strict';

let IssuesEditor = require('./views/IssuesEditor');

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
    let issuesEditor = new IssuesEditor({
        modelUrl: '/api/github/issues'
    });

    ViewHelper.get('NavbarMain').highlightItem('issues');
    
    $('.workspace').html(issuesEditor.$element);
});

Router.route('/github/wiki/', function() {
    ViewHelper.get('NavbarMain').highlightItem('wiki');

    $('.workspace').html('');
});
