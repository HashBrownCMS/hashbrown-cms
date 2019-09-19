'use strict';

/**
 * The editor for the file system deployer
 *
 * @memberof HashBrown.View.Editor.DeployerEditor
 */
class FileSystemDeployerEditor extends HashBrown.View.Editor.Editor {
    static get alias() { return 'filesystem'; }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'editor__field-group'},
            this.field(
                { label: 'Root path', description: 'A path to a folder on this machine' },
                new HashBrown.Entity.View.Widget.Text({
                    model: {
                        value: this.model.rootPath,
                        placeholder: 'Input path',
                        onchange: (newValue) => {
                            this.model.rootPath = newValue;
                        }
                    }
                }).element
            )
        );
    }
}

module.exports = FileSystemDeployerEditor;
