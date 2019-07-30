'use strict';

/**
 * The editor for the Git deployer
 *
 * @memberof HashBrown.Views.Editors.DeployerEditors
 */
class GitDeployerEditor extends HashBrown.Views.Editors.Editor {
    static get alias() { return 'git'; }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'editor__field-group'},
            this.field(
                'Repository (https://)',
                new HashBrown.Views.Widgets.Input({
                    type: 'text',
                    value: this.model.repo,
                    placeholder: 'example.com/user/repo.git',
                    onChange: (newRepo) => {
                        this.model.repo = newRepo;
                    }
                })
            ),
            
            this.field(
                'Branch',
                new HashBrown.Views.Widgets.Input({
                    type: 'text',
                    value: this.model.branch,
                    placeholder: 'master',
                    onChange: (newBranch) => {
                        this.model.branch = newBranch;
                    }
                })
            ),
            
            this.field(
                'Username',
                new HashBrown.Views.Widgets.Input({
                    type: 'text',
                    value: this.model.username,
                    onChange: (newUsername) => {
                        this.model.username = newUsername;
                    }
                })
            ),
            
            this.field(
                'Password',
                new HashBrown.Views.Widgets.Input({
                    type: 'password',
                    value: this.model.password,
                    onChange: (newPassword) => {
                        this.model.password = newPassword;
                    }
                })
            )
        );
    }
}

module.exports = GitDeployerEditor;
