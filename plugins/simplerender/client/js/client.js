'use strict';

let jade = require('jade');

// Editors
require('./editors/TemplateReferenceEditor');

onReady('navbar', function() {
    $.getJSON('/api/simplerender/templates/', function(templates) {
        window.resources.simplerender = {};
        window.resources.simplerender.templates = templates;

        ViewHelper.get('NavbarMain').renderPane({
            label: 'SimpleRender',
            route: '/simplerender/',
            icon: 'code',
            items: [
                {
                    name: 'Operations',
                    path: 'operations',
                    icon: 'cog'
                }
            ]
        });
    });
});

Router.route('/simplerender/', function() {
    ViewHelper.get('NavbarMain').showTab('/github/');

    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('SimpleRender dashboard'),
            _.p('Please pick a feature to proceed')
        )
    );
});

Router.route('/simplerender/operations', function() {
    ViewHelper.get('NavbarMain').showTab('/github/');

    function onClickGenerateSiteMarkup() {
        let renderFunctions = {};

        // Compile templates into render functions
        for(let id in window.resources.templates) {
            renderFunctions[id] = jade.compileClient(templates[id]);
        }
    
        // Look through all content and render it
        for(let content of resources.content) {
            // Only perform the rendering if the function and template id exists
            if(content.templateId && renderFunctions[content.templateId]) {
                let markup = renderFunctions[content.templateId](content);

                console.log(markup);
            }
        }
    }

    $('.workspace').html(
        _.div({class: 'simplerender-container'},
            _.h1('SimpleRender operations'),
            _.button({class: 'btn btn-primary'},
                'Generate all content markup'
            ).click(onClickGenerateSiteMarkup)
        )
    );
});
