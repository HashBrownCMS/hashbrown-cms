'use strict';

const RequestHelper = require('Client/Helpers/RequestHelper');

// Root
Crisp.Router.route('/', function() {
    Crisp.View.get('NavbarMain').showTab('/');
    Crisp.View.get('NavbarMain').highlightItem('/', 'null');

    _.append($('.page--environment__space--editor').empty(),
        _.div({class: 'page--environment__space--editor__text'},
            _.h1('Welcome to HashBrown'),
            _.h2('Example content'),
            _.p('Press the button below to get some example content to work with.'),
            _.button({class: 'widget widget--button'}, 'example')
                .click(() => {
                    RequestHelper.request('post', 'content/example')
                    .then(() => {
                        location.reload();
                    })
                    .catch(UI.errorModal);
                }),
            _.h2('Contextual help'),
            _.p('You can always click the <span class="fa fa-question-circle"></span> icon in the upper right to get information about the screen you\'re currently on.'),
            _.h2('Guides'),
            _.p('If you\'d like a more in-depth walkthrough of the features, please check out the guides.'),
            _.a({class: 'widget widget--button', href: 'http://hashbrown.rocks/guides', target: '_blank'}, 'Guides')
        )
    );
});

// Readme
Crisp.Router.route('/readme', function() {
    Crisp.View.get('NavbarMain').highlightItem('/', 'readme');

    RequestHelper.customRequest('GET', '/text/readme')
    .then((html) => {
        _.append($('.page--environment__space--editor').empty(),
            _.div({class: 'page--environment__space--editor__text'},
                html
            )
        );
    });
});

// License
Crisp.Router.route('/license', function() {
    Crisp.View.get('NavbarMain').highlightItem('/', 'license');

    RequestHelper.customRequest('GET', '/text/license')
    .then((html) => {
        _.append($('.page--environment__space--editor').empty(),
            _.div({class: 'page--environment__space--editor__text'},
                html
            )
        );
    });
});
