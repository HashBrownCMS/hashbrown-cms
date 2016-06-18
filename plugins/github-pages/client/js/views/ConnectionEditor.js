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
        return new Promise((callback) => {
            $.ajax({
                type: 'get',
                url: '/api/github/orgs/?connectionId=' + Router.params.id,
                success: (orgs) => {
                    callback(orgs);
                }
            });
        });
    }
    
    /**
     * Render token editor
     */
    renderTokenEditor() {
        let view = this;
        
        function onChange() {
            view.model.token = $(this).val();
        }

        function onClickRenew() {
            location = '/api/github/oauth/start?route=' + Router.url;
        }

        return _.div({class: 'input-group field-editor'},
            _.input({class: 'form-control', type: 'text', value: Router.query('token') || this.model.token, placeholder: 'Input GitHub API token'})
                .change(onChange),
            _.div({class: 'input-group-btn'},
                _.button({class: 'btn btn-primary'},
                    'Renew'
                ).click(onClickRenew)
            )
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
        this.$element.empty();

        // Token
        _.append(this.$element,
            _.div({class: 'field-container github-token'},
                _.div({class: 'field-key'}, 'Token'),
                _.div({class: 'field-value'},
                    this.renderTokenEditor()
                )
            )
        );
/*
        this.$element.append(
            _.div({class: 'field-container github-repo'},
                _.div({class: 'field-key'}, 'Content directory'),
                _.div({class: 'field-value'},
                    this.renderRepoPicker()
                )
            )
        );

        // Render directory pickers if repo is picked
        if(this.model.repo) {
            this.$element.append([
                _.div({class: 'field-container github-content-dir'},
                    _.div({class: 'field-key'}, 'Content directory'),
                    _.div({class: 'field-value'},
                        this.renderDirPicker('content')
                    )
                ),
                _.div({class: 'field-container github-media-dir'},
                    _.div({class: 'field-key'}, 'Media directory'),
                    _.div({class: 'field-value'},
                        this.renderDirPicker('media')
                    )
                )
            ]);
        }*/
    }
}

resources.connectionEditors.github = ConnectionEditor;
