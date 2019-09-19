'use strict';

/**
 * The editor for the Git deployer
 *
 * @memberof HashBrown.View.Editor.DeployerEditor
 */
class GitDeployerEditor extends HashBrown.View.Editor.Editor {
    static get alias() { return 'git'; }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'editor__field-group'},
            this.field(
                'Repository (https://)',
                new HashBrown.Entity.View.Widget.Text({
                    model: {
                        value: this.model.repo,
                        placeholder: 'example.com/user/repo.git',
                        onchange: (newRepo) => {
                            this.model.repo = newRepo;
                        }
                    }
                }).element
            ),
            
            this.field(
                'Branch',
                new HashBrown.Entity.View.Widget.Text({
                    model: {
                        value: this.model.branch,
                        placeholder: 'master',
                        onchange: (newBranch) => {
                            this.model.branch = newBranch;
                        }
                    }
                }).element
            ),
            
            this.field(
                'Username',
                new HashBrown.Entity.View.Widget.Text({
                    model: {
                        value: this.model.username,
                        onchange: (newUsername) => {
                            this.model.username = newUsername;
                        }
                    }
                }).element
            ),
            
            this.field(
                'Password',
                new HashBrown.Entity.View.Widget.Text({
                    model: {
                        value: this.model.password,
                        onchange: (newPassword) => {
                            this.model.password = newPassword;
                        }
                    }
                }).element
            )
        );
    }
}

module.exports = GitDeployerEditor;
