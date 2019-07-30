'use strict';

/**
 * The editor for the API deployer
 *
 * @memberof HashBrown.Views.Editors.DeployerEditors
 */
class ApiDeployerEditor extends HashBrown.Views.Editors.Editor {
    // Alias
    static get alias() { return 'api'; }
    
    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'editor__field-group'},
            this.field(
                { label: 'URL', description: 'The base URL of the API' },
                new HashBrown.Views.Widgets.Input({
                    type: 'text',
                    value: this.model.url,
                    placeholder: 'Input URL',
                    onChange: (newValue) => {
                        this.model.url = newValue;
                    }
                })
            ),
            this.field(
                { label: 'Token', description: 'An authenticated API token' },
                new HashBrown.Views.Widgets.Input({
                    type: 'text',
                    value: this.model.token,
                    placeholder: 'Input token',
                    onChange: (newValue) => {
                        this.model.token = newValue;
                    }
                })
            )
        );
    }
}

module.exports = ApiDeployerEditor;
