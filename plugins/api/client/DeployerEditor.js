'use strict';

class ApiDeployerEditor extends Crisp.View {
    // Alias
    static get alias() { return 'api'; }

    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.fetch();
    }
    
    /**
     * Render URL editor
     */
    renderUrlEditor() {
        return new HashBrown.Views.Widgets.Input({
            type: 'text',
            value: this.model.url,
            placeholder: 'Input URL',
            onChange: (newValue) => {
                this.model.url = newValue;
            }
        }).$element;
    }
    
    /**
     * Render Token editor
     */
    renderTokenEditor() {
        return new HashBrown.Views.Widgets.Input({
            type: 'text',
            value: this.model.token,
            placeholder: 'Input token',
            onChange: (newValue) => {
                this.model.token = newValue;
            }
        }).$element;
    }
    
    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'deployer-editor deployer-editor--api'},
            // Url
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'},
                    _.div({class: 'editor__field__key__label'}, 'URL'),
                    _.div({class: 'editor__field__key__description'}, 'The base URL of the API')
                ),
                _.div({class: 'editor__field__value'},
                    this.renderUrlEditor()
                )
            ),
            // Token
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'},
                    _.div({class: 'editor__field__key__label'}, 'Token'),
                    _.div({class: 'editor__field__key__description'}, 'An authenticated API token')
                ),
                _.div({class: 'editor__field__value'},
                    this.renderTokenEditor()
                )
            )
        );
    }
}

HashBrown.Views.Editors.DeployerEditors.Api = ApiDeployerEditor;
