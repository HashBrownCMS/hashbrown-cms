'use strict';

/**
 * The editor for connection resources
 */
class ConnectionEditor extends HashBrown.Entity.View.ResourceEditor.ResourceEditorBase {
    static get category() { return 'connections'; }
    
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
        
        if(this.state.name) { return; }

        let connection = await HashBrown.Entity.Resource.Media.getProvider();

        this.state.isMediaProvider = this.model && connection && connection.id === this.model.id;
    }

    /**
     * Pre render
     */
    prerender() {
        if(this.state.name) { return; }

        // Get processor fields
        this.state.processorFields = null;

        if(this.model.processor && this.model.processor.alias) {
            for(let name in HashBrown.Entity.View.DeployerEditor) {
                let type = HashBrown.Entity.View.DeployerEditor[name];

                if(type && type.alias === this.model.processor.alias) {
                    this.state.processorFields = type.new({ model: this.model.processor });
                    break;
                }
            }
        }
       
        if(!this.state.processorFields) {
            this.state.processorFields = HashBrown.Entity.View.ProcessorEditor.ProcessorEditorBase.new({ model: this.model.processor });
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
                    this.state.deployerFields = type.new({ model: this.model.deployer }); 
                    break;
                }
            }
        }

        if(!this.state.deployerFields) {
            this.state.deployerFields = HashBrown.Entity.View.DeployerEditor.DeployerEditorBase.new({ model: this.model.deployer });
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
    async onClickStartTour() {
        if(location.hash.indexOf('connections/') < 0) {
            location.hash = '/connections/';
        }
       
        await new Promise((resolve) => { setTimeout(() => { resolve(); }, 500); });
            
        await UI.highlight('.navigation--resource-browser__tab[href="#/connections/"]', 'This the connections section, where you will configure how HashBrown talks to the outside world.', 'right', 'next');

        await UI.highlight('.panel', 'Here you will find all of your connections. You can right click here to create a new connection.', 'right', 'next');
        
        await UI.highlight('.resource-editor', 'This is the connection editor, where you edit connections.', 'left', 'next');
    }

    /**
     * Event: Change name
     */
    onChangeName(newValue) {
        this.model.name = newValue;

        this.onChange();
    }
    
    /**
     * Event: Change URL
     */
    onChangeUrl(newValue) {
        this.model.url = newValue;

        this.onChange();
    }

    /**
     * Event: Change processor
     */
    onChangeProcessor(newValue) {
        if(!newValue) { return; }

        this.model.processor = newValue;

        this.onChange();
    }
    
    /**
     * Event: Change deployer
     */
    onChangeDeployer(newValue) {
        if(!newValue) { return; }

        this.model.deployer = newValue;

        this.onChange();
    }

    /**
     * Event: Change is media provider
     */
    async onChangeIsMediaProvider(newValue) {
        this.setSaveOption('isMediaProvider', newValue);
    }
}

module.exports = ConnectionEditor;
