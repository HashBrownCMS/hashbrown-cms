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
     * Render local switch
     */
    renderLocalSwitch() {
        return _.div({class: 'field-editor'},
            UI.inputSwitch(this.model.isLocal == true, (newValue) => {
                this.model.isLocal = newValue;

                this.render();
            })
        );
    }

    /**
     * Render local path editor
     */
    renderLocalPathEditor() {
        let view = this;
        
        function onChange() {
            view.model.localPath = $(this).val();

            view.render();
        }

        return _.div({class: 'field-editor'},
            _.input({class: 'form-control', type: 'text', value: this.model.localPath, placeholder: 'Input local path'})
                .change(onChange)
        );
    }
    
    /**
     * Render token editor
     */
    renderTokenEditor() {
        let view = this;
        
        function onChange() {
            view.model.token = $(this).val();

            view.render();
        }

        this.model.token = Router.query('token') || this.model.token; 

        return _.div({class: 'field-editor'},
            _.input({class: 'form-control', type: 'text', value: this.model.token, placeholder: 'Input GitHub API token'})
                .change(onChange)
        );
    }
    
    /**
     * Render organisation picker
     */
    renderOrgPicker() {
        let view = this;
        
        let $editor = _.div({class: 'field-editor dropdown-editor'},
            _.select({class: 'form-control'},
                _.option({value: this.model.org}, this.model.org)
            ).change(onChange)
        );
        
        function onChange() {
            let org = $(this).val();

            view.model.org = org;

            view.render();
        }
        
        $editor.children('select').val(view.model.org);

        if(this.model.token) {
            $.ajax({
                type: 'get',
                url: '/api/github/orgs?token=' + this.model.token,
                success: (orgs) => {
                    _.append($editor.children('select').empty(),
                        _.option({value: ''}, '(none)'),
                        _.if(typeof orgs === 'object',
                            _.each(orgs, function(i, org) {
                                return _.option({value: org.login}, org.login);
                            })
                        )
                    );
                    
                    $editor.children('select').val(view.model.org);
                }
            });
        }

        return $editor;
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

        if(this.model.token) {
            $.ajax({
                type: 'get',
                url: '/api/github/repos?token=' + this.model.token + '&org=' + this.model.org,
                success: (repos) => {
                    if(typeof repos === 'object') {
                        $editor.children('select').html(
                            _.each(repos, function(i, repo) {
                                return _.option({value: repo.full_name}, repo.full_name);
                            })
                        );
                        
                        $editor.children('select').val(view.model.repo);
                    }
                }
            });
        }

        return $editor;
    }

    /**
     * Render branch picker
     */
    renderBranchPicker() {
        let view = this;
        
        let $editor = _.div({class: 'field-editor dropdown-editor'},
            _.select({class: 'form-control'},
                _.option({value: this.model.branch}, this.model.branch)
            ).change(onChange)
        );
        
        function onChange() {
            let branch = $(this).val();

            view.model.branch = branch;

            view.render();
        }
        
        $editor.children('select').val(view.model.branch);

        if(this.model.token && this.model.repo) {
            $.ajax({
                type: 'get',
                url: '/api/github/' + this.model.repo + '/branches?token=' + this.model.token + '&org=' + this.model.org,
                success: (branches) => {
                    if(typeof branches === 'object') {
                        $editor.children('select').html(
                            _.each(branches, function(i, branch) {
                                return _.option({value: branch.name}, branch.name);
                            })
                        );
                        
                        $editor.children('select').val(view.model.branch);
                    }
                }
            });
        }

        return $editor;
    }

    render() {
        _.append(this.$element.empty(),
            // Local switch
            _.div({class: 'field-container is-local'},
                _.div({class: 'field-key'}, 'Local'),
                _.div({class: 'field-value'},
                    this.renderLocalSwitch()
                )
            ),
            _.if(this.model.isLocal,
                // Path
                _.div({class: 'field-container local-path'},
                    _.div({class: 'field-key'}, 'Local path'),
                    _.div({class: 'field-value'},
                        this.renderLocalPathEditor()
                    )
                )
            ),
            _.if(!this.model.isLocal,
                // Token
                _.div({class: 'field-container github-token'},
                    _.div({class: 'field-key'}, 'Token'),
                    _.div({class: 'field-value'},
                        this.renderTokenEditor()
                    )
                ),
                
                // Org picker
                _.div({class: 'field-container github-org'},
                    _.div({class: 'field-key'}, 'Organisation'),
                    _.div({class: 'field-value'},
                        this.renderOrgPicker()
                    )
                ),
                
                // Repo picker
                _.div({class: 'field-container github-repo'},
                    _.div({class: 'field-key'}, 'Repository'),
                    _.div({class: 'field-value'},
                        this.renderRepoPicker()
                    )
                ),
                
                // Branch picker
                _.div({class: 'field-container github-branch'},
                    _.div({class: 'field-key'}, 'Branch'),
                    _.div({class: 'field-value'},
                        this.renderBranchPicker()
                    )
                )
            )
        );
    }
}

resources.connectionEditors['GitHub Pages'] = ConnectionEditor;
