'use strict';

let Promise = require('bluebird');
let IssuesEditor = require('./views/IssuesEditor');
let BoardEditor = require('./views/BoardEditor');

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
                name: 'Board',
                path: 'board',
                icon: 'columns'
            },
            {
                name: 'Wiki',
                path: 'wiki',
                icon: 'book'
            }
        ]
    });
});

function showLogin() {
    return new Promise(function(callback) {
        function onSubmit(e) {
            e.preventDefault();

            let $form = $(this);

            $.post('/api/github/login', $form.serialize(), function(data, textStatus) {
                console.log('[GitHub] Log in ' + textStatus);

                if(textStatus == 'success') {
                    callback();
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
}

function checkLogin() {
    $('.workspace').html(
        _.div({class: 'dashboard-container'}, [
            _.div({class: 'panel panel-login'}, [
                _.div({class: 'panel-heading'},
                    _.div({class: 'login-icon'},
                        _.span({class: 'fa fa-github'})
                    )
                ),
                _.div({class: 'panel-body'}, 
                    _.div({class: 'spinner-container'},
                        _.span({class: 'spinner fa fa-refresh'})
                    )
                )
            ])
        ])
    );
    
    return new Promise(function(callback) {
        $.ajax({
            type: 'post',
            data: {},
            url: '/api/github/login',
            success: function() {
                callback();
            },
            error: function() {
                showLogin()
                .then(function() {
                    location.reload();
                });
            }
        });
    });
}

Router.route('/github/', function() {
    ViewHelper.get('NavbarMain').showTab('/github/');
    
    showLogin();
});

Router.route('/github/issues/', function() {
    ViewHelper.get('NavbarMain').highlightItem('issues');
    
    checkLogin()
    .then(function() {
        let issuesEditor = new IssuesEditor({
            modelUrl: '/api/github/issues'
        });
        
        $('.workspace').html(issuesEditor.$element);
    });
});

Router.route('/github/board/', function() {
    ViewHelper.get('NavbarMain').highlightItem('board');
    
    checkLogin()
    .then(function() {
        let boardEditor = new BoardEditor({
            modelUrl: '/api/github/issues'
        });
        
        $('.workspace').html(boardEditor.$element);
    });
});

Router.route('/github/wiki/', function() {
    ViewHelper.get('NavbarMain').highlightItem('wiki');

    $('.workspace').html('');
});
