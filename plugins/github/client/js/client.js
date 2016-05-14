'use strict';

let Promise = require('bluebird');
let IssuesEditor = require('./views/IssuesEditor');
let BoardEditor = require('./views/BoardEditor');
let UploadEditor = require('./views/UploadEditor');

resources.connectionEditors.github = UploadEditor;

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
