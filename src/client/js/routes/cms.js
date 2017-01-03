'use strict';

// Root
Router.route('/', function() {
    ViewHelper.get('NavbarMain').showTab('/');

    _.append($('.workspace').empty(),
        _.div({class: 'dashboard-container welcome'},
            _.h1('Welcome to HashBrown'),
            _.p('If you\'re unfamiliar with HashBrown, please take a moment to look through the introduction below. It\'ll only take a minute'),
            _.h2('Introduction'), 
            UI.carousel([
                _.div(
                    _.img({src: '/img/welcome/intro-content.jpg'}),
                    _.h2('Content'),
                    _.p('In the content section you will find all of your authored work. The content is a hierarchical tree of nodes that can contain text and media, in simple or complex structures.')
                ),
                _.div(
                    _.img({src: '/img/welcome/intro-media.jpg'}),
                    _.h2('Media'),
                    _.p('An asset library for your hosted files, such as images, videos, PDFs and whatnot.')
                ),
                _.div(
                    _.img({src: '/img/welcome/intro-forms.jpg'}),
                    _.h2('Forms'),
                    _.p('If you need an input form on your website, you can create the model for it here and see a list of the user submitted input.')
                ),
                _.div(
                    _.img({src: '/img/welcome/intro-connections.jpg'}),
                    _.h2('Connections'),
                    _.p('A list of endpoints and resources for your content. Connections can be set up to publish your content to other servers, provide statically hosted media and serve rendering templates.')
                ),
                _.div(
                    _.img({src: '/img/welcome/intro-schemas.jpg'}),
                    _.h2('Schemas'),
                    _.p('A library of content structures. Here you define how your editable content looks and behaves. You can define schemas for both content nodes and fields.')
                ),
                _.div(
                    _.img({src: '/img/welcome/intro-users.jpg'}),
                    _.h2('Users'),
                    _.p('All of the users connected to this project. Here you can edit scopes and remove/add new users.')
                ),
                _.div(
                    _.img({src: '/img/welcome/intro-settings.jpg'}),
                    _.h2('Settings'),
                    _.p('The environment settings, such as synchronisation setup')
                )
            ], true, true, '400px')
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
