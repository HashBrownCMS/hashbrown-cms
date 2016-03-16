'use strict';

// TODO: Make this a ready callback
setTimeout(function() {
    ViewHelper.get('NavbarMain').renderPane({
        label: 'GitHub',
        route: '/github/',
        icon: 'github',
        items: [
            {
                name: 'Issues',
                path: 'issues',
                icon: 'exclamation-circle'
            }
        ]
    });
}, 500);
