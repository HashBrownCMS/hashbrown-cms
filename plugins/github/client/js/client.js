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

        let template = new Template({
            divDashboardContainer: { class: 'dashboard-container',
                divLoginContainer: { class: 'panel panel-login',
                    divPanelHeading: { class: 'panel-heading',
                        divIconContainer: { class: 'login-icon',
                            spanIcon: { class: 'fa fa-github' }
                        }
                    },
                    divPanelBody: { class: 'panel-body', 
                        formLogin: {
                            on: { 
                                'submit': onSubmit
                            },
                            inputUsername: { type: 'text', name: 'usr', class: 'form-control', placeholder: 'Username' },
                            inputPassword: { type: 'password', name: 'pwd', class: 'form-control', placeholder: 'Password' },
                            inputButton: { type: 'submit', class: 'btn btn-primary', value: 'Log in' }
                        }
                    }
                }
            }
        });

        $('.workspace').html(
            template.html
        );
    });
}

function checkLogin() {
    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.div({class: 'panel panel-login'},
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
            )
        )
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
                    callback();
                });
            }
        });
    });
}

Router.route('/github/', function() {
    ViewHelper.get('NavbarMain').showTab('/github/');
    
    checkLogin()
    .then(function() {
        $('.workspace').html(
            _.div({class: 'dashboard-container'},
                _.h1('GitHub dashboard'),
                _.p('Please pick a feature to proceed')
            )
        );
    });
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
