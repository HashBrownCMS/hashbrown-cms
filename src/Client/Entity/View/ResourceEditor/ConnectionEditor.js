'use strict';

/**
 * The editor for connection resources
 */
class ConnectionEditor extends HashBrown.Entity.View.ResourceEditor.ResourceEditorBase {
    static get category() { return 'connections'; }
    static get itemType() { return HashBrown.Entity.Resource.Connection; }
    
    /**
     * Constructor
     */
    constructor(params) {
        super(params);
        
        this.template = require('template/resourceEditor/connectionEditor.js');
    }

    /**
     * Fetches view data
     */
    async fetch() {
        await super.fetch();

        let connection = await HashBrown.Service.ConnectionService.getMediaProvider();

        this.state.isMediaProvider = connection && connection.id === this.model.id;
    }

    /**
     * Pre render
     */
    prerender() {
        this.state.icon = 'exchange';
        this.state.title = this.model.title;

        // Get processor fields
        this.state.processorFields = null;

        if(this.model.processor && this.model.processor.alias) {
            for(let name in HashBrown.Entity.View.DeployerEditor) {
                let type = HashBrown.Entity.View.DeployerEditor[name];

                if(type && type.alias === this.model.processor.alias) {
                    this.state.processorFields = new type({ model: this.model.processor });
                    break;
                }
            }
        }
       
        if(!this.state.processorFields) {
            this.state.processorFields = new HashBrown.Entity.View.ProcessorEditor.ProcessorEditorBase({ model: this.model.processor });
        }

        this.state.processorFields.on('change', (newValue) => {
            this.onChangeProcessor(newValue);
        });
        
        this.state.processorFields.on('changealias', () => {
            this.render();
        });
        
        // Get deployer fields
        this.state.deployerFields = null;

        if(this.model.deployer && this.model.deployer.alias) {
            for(let name in HashBrown.Entity.View.DeployerEditor) {
                let type = HashBrown.Entity.View.DeployerEditor[name];

                if(type && type.alias === this.model.deployer.alias) {
                    this.state.deployerFields = new type({ model: this.model.deployer }); 
                    break;
                }
            }
        }

        if(!this.state.deployerFields) {
            this.state.deployerFields = new HashBrown.Entity.View.DeployerEditor.DeployerEditorBase({ model: this.model.deployer });
        }
        
        this.state.deployerFields.on('change', (newValue) => {
            this.onChangeDeployer(newValue);
        });
        
        this.state.deployerFields.on('changealias', () => {
            this.render();
        });
    }

    /**
     * Event: Click start tour
     */
    onClickStartTour() {
        HashBrown.Service.ConnectionService.startTour();
    }

    /**
     * Event: Change title
     */
    onChangeTitle(newValue) {
        this.model.title = newValue;

        this.trigger('change', this.model);
    }
    
    /**
     * Event: Change URL
     */
    onChangeUrl(newValue) {
        this.model.url = newValue;

        this.trigger('change', this.model);
    }

    /**
     * Event: Change processor
     */
    onChangeProcessor(newValue) {
        if(!newValue) { return; }

        this.model.processor = newValue;

        this.trigger('change', this.model);
    }
    
    /**
     * Event: Change deployer
     */
    onChangeDeployer(newValue) {
        if(!newValue) { return; }

        this.model.deployer = newValue;

        this.trigger('change', this.model);
    }

    /**
     * Event: Change is media provider
     */
    async onChangeIsMediaProvider(newValue) {
        await HashBrown.Service.ConnectionService.setMediaProvider(newValue ? this.model.id : null);
    }
}

module.exports = ConnectionEditor;
