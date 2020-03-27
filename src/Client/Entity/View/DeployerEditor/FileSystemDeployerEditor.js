'use strict';

/**
 * The editor for the file system deployer
 *
 * @memberof HashBrown.Client.Entity.View.DeployerEditor
 */
class FileSystemDeployerEditor extends HashBrown.Entity.View.DeployerEditor.DeployerEditorBase {
    static get alias() { return 'filesystem'; }

    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.customTemplate = require('template/deployerEditor/inc/fileSystemDeployerEditor.js');
    }

    /**
     * Event: Change root path
     */
    onChangeRootPath(newValue) {
        this.model.rootPath = newValue;

        this.trigger('change', this.model);
    }
}

module.exports = FileSystemDeployerEditor;
