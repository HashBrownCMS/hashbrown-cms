'use strict';

/**
 * The editor for the API deployer
 *
 * @memberof HashBrown.Client.Entity.View.DeployerEditor
 */
class GitDeployerEditor extends HashBrown.Entity.View.DeployerEditor.DeployerEditorBase {
    static get alias() { return 'git'; }

    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.customTemplate = require('template/deployerEditor/inc/gitDeployerEditor.js');
    }

    /**
     * Event: Change repo
     */
    onChangeRepo(newValue) {
        this.model.repo = newValue;

        this.trigger('change', this.model);
    }
    
    /**
     * Event: Change branch
     */
    onChangeBranch(newValue) {
        this.model.branch = newValue;

        this.trigger('change', this.model);
    }
    
    /**
     * Event: Change username
     */
    onChangeUsername(newValue) {
        this.model.username = newValue;

        this.trigger('change', this.model);
    }
    
    /**
     * Event: Change password
     */
    onChangePassword(newValue) {
        this.model.password = newValue;

        this.trigger('change', this.model);
    }
}

module.exports = GitDeployerEditor;
