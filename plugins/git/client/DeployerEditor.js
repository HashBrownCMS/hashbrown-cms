'use strict';

class GitDeployerEditor extends Crisp.View {
    // Alias
    static get alias() { return 'git'; }

    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'deployer-editor deployer-editor--git'},
            // Repository
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Repository (https://)'),
                _.div({class: 'editor__field__value'},
                    new HashBrown.Views.Widgets.Input({
                        type: 'text',
                        value: this.model.repo,
                        placeholder: 'example.com/user/repo.git',
                        onChange: (newRepo) => {
                            this.model.repo = newRepo;
                        }
                    })
                )
            ),
            
            // Branch
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Branch'),
                _.div({class: 'editor__field__value'},
                    new HashBrown.Views.Widgets.Input({
                        type: 'text',
                        value: this.model.branch,
                        placeholder: 'master',
                        onChange: (newBranch) => {
                            this.model.branch = newBranch;
                        }
                    })
                )
            ),
            
            // Username
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Username'),
                _.div({class: 'editor__field__value'},
                    new HashBrown.Views.Widgets.Input({
                        type: 'text',
                        value: this.model.username,
                        onChange: (newUsername) => {
                            this.model.username = newUsername;
                        }
                    })
                )
            ),
            
            // Password
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Password'),
                _.div({class: 'editor__field__value'},
                    new HashBrown.Views.Widgets.Input({
                        type: 'password',
                        value: this.model.password,
                        onChange: (newPassword) => {
                            this.model.password = newPassword;
                        }
                    })
                )
            )
        );
    }
}

HashBrown.Views.Editors.DeployerEditors.Git = GitDeployerEditor;
