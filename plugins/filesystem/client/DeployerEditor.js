'use strict';

class FileSystemDeployerEditor extends Crisp.View {
    // Alias
    static get alias() { return 'filesystem'; }

    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.fetch();
    }
    
    /**
     * Render local path editor
     */
    renderPathEditor() {
        return new HashBrown.Views.Widgets.Input({
            type: 'text',
            value: this.model.rootPath,
            placeholder: 'Input path',
            onChange: (newValue) => {
                this.model.rootPath = newValue;
            }
        }).$element;
    }
    
    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'deployer-editor deployer-editor--filesystem'},
            // Path
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'},
                    _.div({class: 'editor__field__key__label'}, 'Root path'),
                    _.div({class: 'editor__field__key__description'}, 'A path to a folder on this machine')
                ),
                _.div({class: 'editor__field__value'},
                    this.renderPathEditor()
                )
            )
        );
    }
}

HashBrown.Views.Editors.DeployerEditors.FileSystem = FileSystemDeployerEditor;
