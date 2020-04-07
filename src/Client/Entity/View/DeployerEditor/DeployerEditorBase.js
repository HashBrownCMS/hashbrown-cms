'use strict';

/**
 * The base view for deployer editors
 *
 * @memberof HashBrown.Entity.View.ProcessorEditor
 */
class DeployerEditorBase extends HashBrown.Entity.View.ViewBase {
    static get alias() { return ''; }

    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/deployerEditor/deployerEditorBase.js');
    }

    /**
     * Creates a new instance
     *
     * @return {HashBrown.Entity.View.DeployerEditor.DeployerEditorBase} Editor
     */
    static new(params = {}) {
        if(params.model && params.model.alias) {
            for(let name in HashBrown.Entity.View.DeployerEditor) {
                let type = HashBrown.Entity.View.DeployerEditor[name];

                if(type && type.alias === params.model.alias) {
                    return new type(params);
                }
            }
        }
    
        return new this(params);
    }

    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(Function, 'customTemplate', null);
    }
    
    /**
     * Gets the placeholder
     *
     * @return {HTMLElement} Placeholder
     */
    getPlaceholder(_, model, state) {
        return _.div({class: 'deployer-editor loading'});
    }
    
    /**
     * Fetch
     */
    async fetch() {
        this.state.deployerOptions = {};
        
        let deployers = await HashBrown.Service.RequestService.customRequest('get', '/api/deployers');

        for(let deployer of deployers) {
            this.state.deployerOptions[deployer] = deployer;
        }
    }
    
    /**
     * Pre render
     */
    prerender() {
        this.state.customTemplate = this.customTemplate;
    }

    /**
     * Event: Change alias
     */
    onChangeAlias(newValue) {
        this.model.alias = newValue;

        this.trigger('change', this.model);
        this.trigger('changealias');
    }
    
    /**
     * Event: Change public URL
     */
    onChangePublicUrl(newValue) {
        this.model.publicUrl = newValue;

        this.trigger('change', this.model);
    }
    
    /**
     * Event: Change path
     */
    onChangePath(newValue) {
        this.model.path = newValue;

        this.trigger('change', this.model);
    }
}

module.exports = DeployerEditorBase;
