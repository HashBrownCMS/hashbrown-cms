'use strict';

/**
 * The editor for the API deployer
 *
 * @memberof HashBrown.Client.Entity.View.DeployerEditor
 */
class ApiDeployerEditor extends HashBrown.Entity.View.DeployerEditor.DeployerEditorBase {
    static get alias() { return 'api'; }

    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.customTemplate = require('template/deployerEditor/inc/apiDeployerEditor.js');
    }

    /**
     * Event: Change URL
     */
    onChangeUrl(newValue) {
        this.model.url = newValue;

        this.trigger('change', this.model);
    }
    
    /**
     * Event: Change token
     */
    onChangeToken(newValue) {
        this.model.token = newValue;

        this.trigger('change', this.model);
    }
}

module.exports = ApiDeployerEditor;
