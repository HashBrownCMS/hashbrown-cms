'use strict';

/**
 * The editor for the file system deployer
 *
 * @memberof HashBrown.Views.Editors.DeployerEditors
 */
class FileSystemDeployerEditor extends HashBrown.Views.Editors.Editor {
    static get alias() { return 'filesystem'; }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'editor__field-group'},
            this.field(
                { label: 'Root path', description: 'A path to a folder on this machine' },
                new HashBrown.Views.Widgets.Input({
                    type: 'text',
                    value: this.model.rootPath,
                    placeholder: 'Input path',
                    onChange: (newValue) => {
                        this.model.rootPath = newValue;
                    }
                })
            )
        );
    }
}

module.exports = FileSystemDeployerEditor;
