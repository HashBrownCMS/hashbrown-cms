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

        this.model.token = Router.query('token') || this.model.token; 

        return _.div({class: 'input-group field-editor'},
            _.input({class: 'form-control', type: 'text', value: this.model.token, placeholder: 'Input GitHub API token'})
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
        
        let $editor = _.div({class: 'field-editor dropdown-editor'},
            _.select({class: 'form-control'},
                _.option({value: this.model.repo}, this.model.repo)
            ).change(onChange)
        );
        
        function onChange() {
            let repo = $(this).val();

            view.model.repo = repo;

            view.render();
        }
        
        $editor.children('select').val(view.model.repo);

        $.ajax({
            type: 'get',
            url: '/api/github/repos?token=' + this.model.token,
            success: (repos) => {
                $editor.children('select').html(
                    _.each(repos, function(i, repo) {
                        return _.option({value: repo.full_name}, repo.full_name);
                    })
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

        let $editor = _.div({class: 'field-editor dropdown-editor'},
            _.select({class: 'form-control'},
                _.option({value: this.model[alias]}, this.model[alias])
            ).change(onChange)
        );

        function onChange() {
            let dir = $(this).val();

            view.model[alias] = dir;
        }
        
        $editor.children('select').val(this.model[alias]);

        $.ajax({
            type: 'get',
            url: '/api/github/' + this.model.repo + '/dirs?token=' + this.model.token,
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

                $editor.children('select').html(
                    _.each(view.dirs, function(i, dir) {
                        return _.option({value: dir}, dir);
                    })
                );
                
                $editor.children('select').val(view.model[alias]);
            }
        });

        return $editor;
    }

    render() {
        this.$element.empty();

        _.append(this.$element,
            // Token
            _.div({class: 'field-container github-token'},
                _.div({class: 'field-key'}, 'Token'),
                _.div({class: 'field-value'},
                    this.renderTokenEditor()
                )
            ),
            
            // Repo picker
            _.div({class: 'field-container github-repo'},
                _.div({class: 'field-key'}, 'Repository'),
                _.div({class: 'field-value'},
                    this.renderRepoPicker()
                )
            ),
            
            // Content dir picker
            _.div({class: 'field-container github-content-dir'},
                _.div({class: 'field-key'}, 'Content directory'),
                _.div({class: 'field-value'},
                    this.renderDirPicker('content')
                )
            ),

            // Media dir picker
            _.div({class: 'field-container github-media-dir'},
                _.div({class: 'field-key'}, 'Media directory'),
                _.div({class: 'field-value'},
                    this.renderDirPicker('media')
                )
            )
        );
    }
}

resources.connectionEditors['GitHub Pages'] = ConnectionEditor;
