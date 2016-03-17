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

    function onSubmit(e) {
        e.preventDefault();

        let $form = $(this);

        $.post('/api/github/login', $form.serialize(), function(data, textStatus) {
            console.log('[GitHub] Log in ' + textStatus);

            if(textStatus == 'success') {
                $form.hide();
            }
        });
    }

    $('.workspace').html(
        _.div({class: 'dashboard-container'}, [
            _.div({class: 'panel panel-login'}, [
                _.div({class: 'panel-heading'},
                    _.div({class: 'login-icon'},
                        _.span({class: 'fa fa-github'})
                    )
                ),
                _.div({class: 'panel-body'}, 
                    _.form([
                        _.input({type: 'text', name: 'usr', class: 'form-control', placeholder: 'Username'}),
                        _.input({type: 'password', name: 'pwd', class: 'form-control', placeholder: 'Password'}),
                        _.input({type: 'submit', class: 'btn btn-primary', value: 'Log in'})
                    ]).on('submit', onSubmit)
                )
            ])
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
