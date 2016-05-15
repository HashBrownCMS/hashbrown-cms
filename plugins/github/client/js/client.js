'use strict';

let Promise = require('bluebird');

/**
 * The GitHub connection editor for Endomon CMS
 */
class GitHub extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'github-editor'});

        this.fetch();
    }

    /**
     * Shows the login prompt
     */
    showLogin() {
        let view = this;

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

            view.$element.html(
                template.html
            );
        });
    }

    /**
     * Checks if user is logged in
     */
    checkLogin() {
        let view = this;

        return new Promise(function(callback) {
            // TODO: Perform check
        });
    }

    /**
     * Render OAuth editor
     */
    renderOAuthEditor() {
        let view = this;
        let $editor = _.div({class: 'field-editor input-group'});

        function onChangeClientId() {
            view.model.clientId = $(this).val();

            render();
        } 
        
        function onClickGenerateToken() {
            location = '/api/github/oauth/' + view.model.clientId + '/' + Router.params.id;
        }

        function render() {
            $editor.html(
                _.input({class: 'form-control', value: view.model.clientId, placeholder: 'Client id'})
                    .change(onChangeClientId)
            );

            if(view.model.clientId) {
                $editor.append(
                    _.div({class: 'input-group-addon'},
                        _.button({class: 'btn btn-primary'}, 'Generate token')
                            .click(onClickGenerateToken)
                    )
                );
            }

            if(view.model.token) {
                $editor.append(
                    _.p({class: 'greyed'}, view.model.token)
                );
            }
        }

        render();

        return $editor;
    }

    /**
     * Render organisation picker
     */
    renderOrgPicker() {
        let view = this;

        let $editor = _.div({class: 'field-editor dropdown-editor'});

        function onChange() {
            let org = $(this).val();

            view.model.org = org;

            view.render();
        }
        
        $.ajax({
            type: 'get',
            url: '/api/github/orgs',
            success: function(orgs) {
                $editor.html(
                    _.select({class: 'form-control'},
                        _.each(orgs, function(i, org) {
                            return _.option({value: org.login}, org.login);
                        })
                    ).change(onChange)
                );
                
                $editor.children('select').val(view.model.org);
            }
        });

        return $editor;
    }

    /**
     * Render repository picker
     */
    renderRepoPicker() {
        let view = this;
        
        let $editor = _.div({class: 'field-editor dropdown-editor'});
        
        function onChange() {
            let repo = $(this).val();

            view.model.repo = repo;

            view.render();
        }
        
        $.ajax({
            type: 'get',
            url: '/api/github/' + view.model.org + '/repos',
            success: function(orgs) {
                $editor.html(
                    _.select({class: 'form-control'},
                        _.each(repos, function(i, repos) {
                            return _.option({value: repo.name}, repo.name);
                        })
                    ).change(onChange)
                );
                
                $editor.children('select').val(view.model.repo);
            }
        });

        return $editor;
    }

    /**
     * Render directory picker
     *
     * @param {String} alias
     */
    renderDirPicker(alias, defaultValue) {
        let view = this;

        let $editor = _.div({class: 'field-editor dropdown-editor'});

        function onChange() {
            let dir = $(this).val();

            view.model[alias] = dir;
        }
        
        $.ajax({
            type: 'get',
            url: '/api/github/' + view.model.org + '/' + view.model.repo + '/dirs',
            success: function(dirs) {
                view.dirs = dirs;

                // Use alias as fallback dir name
                if(!view.model[alias]) {
                    let foundFallbackDir = false;

                    // Look for fallback dir name in remote directories
                    for(let dir of view.dirs) {
                        if(dir == alias) {
                            foundFallbackDir = true;
                            break;
                        }
                    }

                    // If not found, add it
                    if(!foundFallbackDir) {
                        view.dirs.push(alias);
                    }

                    view.model[alias] = alias;
                }

                $editor.html(
                    _.select({class: 'form-control'},
                        _.each(view.dirs, function(i, dir) {
                            return _.option({value: dir}, '/' + dir);
                        })
                    ).change(onChange)
                );
                
                $editor.children('select').val(view.model[alias]);
            }
        });

        return $editor;
    }

    render() {
        let view = this;

        view.$element.html(
            _.div({class: 'field-container github-credentials'},
                _.div({class: 'field-key'}, 'OAuth credentials'),
                _.div({class: 'field-value'},
                    view.renderOAuthEditor()
                )
            )
        );

        this.checkLogin()
        .then(() => {
            view.$element.append([
                _.div({class: 'field-container github-org'},
                    _.div({class: 'field-key'}, 'Organisation'),
                    _.div({class: 'field-value'},
                        view.renderOrgPicker()
                    )
                ),
                _.if(view.model.org,
                    _.div({class: 'field-container github-repo'},
                        _.div({class: 'field-key'}, 'Repository'),
                        _.div({class: 'field-value'},
                            view.renderRepoPicker()
                        )
                    )
                ),
                _.if(view.model.repo && view.model.org,
                    _.div({class: 'field-container github-content-dir'},
                        _.div({class: 'field-key'}, 'Content directory'),
                        _.div({class: 'field-value'},
                            view.renderDirPicker('content')
                        )
                    ),
                    _.div({class: 'field-container github-media-dir'},
                        _.div({class: 'field-key'}, 'Media directory'),
                        _.div({class: 'field-value'},
                            view.renderDirPicker('media')
                        )
                    )
                )
            ]);
        });
    }
}

resources.connectionEditors.github = GitHub;
