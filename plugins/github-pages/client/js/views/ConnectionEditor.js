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

        $.ajax({
            type: 'get',
            url: '/api/github/orgs?token=' + this.model.token,
            success: (orgs) => {
                _.append($editor.children('select').empty(),
                    _.option({value: ''}, '(none)'),
                    _.each(orgs, function(i, org) {
                        return _.option({value: org.login}, org.login);
                    })
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
            url: '/api/github/repos?token=' + this.model.token + '&org=' + this.model.org,
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
            )
        );
    }
}

resources.connectionEditors['GitHub Pages'] = ConnectionEditor;
