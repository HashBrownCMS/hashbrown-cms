/**
 * The ConnectionEditor connection editor for Endomon CMS
 */
class ConnectionEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'github-editor'});

        this.fetch();
    }

    /**
     * Get organisations
     */
    getOrgs() {
        let view = this;

        return new Promise(function(callback) {
            $.ajax({
                type: 'get',
                url: '/api/github/orgs/?token=' + view.model.token,
                success: (orgs) => {
                    callback(orgs);
                }
            });
        });
    }
    
    /**
     * Render compiling editor
     */
    renderCompilingEditor() {
        let view = this;

        view.model.compileForJekyll =
            view.model.compileForJekyll == 'true' ||
            view.model.compileForJekyll == true;

        function onChange() {
            view.model.compileForJekyll = this.checked;
        } 
        
        return _.div({class: 'field-editor'},
            _.div({class: 'switch'},
                _.input({
                    id: 'switch-github-compiling',
                    class: 'form-control switch',
                    type: 'checkbox',
                    checked: view.model.compileForJekyll
                }).change(onChange),
                _.label({for: 'switch-github-compiling'})
            )
        );
    }

    /**
     * Render client editor
     */
    renderClientEditor() {
        let view = this;

        function onChangeClientId() {
            view.model.clientId = $(this).val();
        } 
        
        function onChangeClientSecret() {
            view.model.clientSecret = $(this).val();
        } 
        
        return _.div({class: 'field-editor input-group'},
            _.input({class: 'form-control', value: this.model.clientId, placeholder: 'Client id'})
                .change(onChangeClientId),
            _.input({class: 'form-control', value: this.model.clientSecret, placeholder: 'Client secret'})
                .change(onChangeClientSecret)
        );
    }

    /**
     * Render token editor
     */
    renderTokenEditor() {
        let view = this;

        function onClickGenerateToken() {
            location = '/api/github/oauth/' + view.model.clientId + '/' + view.model.clientSecret + '/' + Router.params.id;
        }

        return _.div({class: 'field-editor'},
            _.if(view.model.token,
                _.label(view.model.token)
            ),
            _.button({class: 'btn btn-primary'}, 'Update token')
                .click(onClickGenerateToken)
        );
    }

    /**
     * Render organisation picker
     */
    renderOrgPicker(orgs) {
        let view = this;

        function onChange() {
            let org = $(this).val();

            view.model.org = org;

            view.render();
        }
        
        return _.div({class: 'field-editor dropdown-editor'},
            _.select({class: 'form-control'},
                _.each(orgs, function(i, org) {
                    return _.option({value: org.login}, org.login);
                })
            ).change(onChange).val(view.model.org)
        );
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
        
        view.$element.empty();

        // Compiling
        view.$element.append(
            _.div({class: 'field-container github-compiling'},
                _.div({class: 'field-key'}, 'Compile for Jekyll'),
                _.div({class: 'field-value'},
                    view.renderCompilingEditor()
                )
            )
        );

        // Client
        view.$element.append(
            _.div({class: 'field-container github-client'},
                _.div({class: 'field-key'}, 'Client'),
                _.div({class: 'field-value'},
                    view.renderClientEditor()
                )
            )
        );
        
        // Token
        view.$element.append(
            _.div({class: 'field-container github-token'},
                _.div({class: 'field-key'}, 'Token'),
                _.div({class: 'field-value'},
                    view.renderTokenEditor()
                )
            )
        );

        // Get organisations
        view.getOrgs()
        .then((orgs) => {
            // Render organisation picker
            view.$element.append(
                _.div({class: 'field-container github-org'},
                    _.div({class: 'field-key'}, 'Organisation'),
                    _.div({class: 'field-value'},
                        view.renderOrgPicker(orgs)
                    )
                )
            );
            
            // Render repo picker if org has been picked
            if(view.model.org) {
                view.$element.append(
                    _.div({class: 'field-container github-repo'},
                        _.div({class: 'field-key'}, 'Content directory'),
                        _.div({class: 'field-value'},
                            view.renderRepoPicker()
                        )
                    )
                );

                // Render directory pickers if repo is picked
                if(view.model.repo) {
                    view.$element.append([
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
                    ]);
                }
            }
        });
    }
}

resources.connectionEditors.github = ConnectionEditor;
