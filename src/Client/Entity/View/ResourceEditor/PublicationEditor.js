'use strict';

/**
 * The editor for publication resources
 */
class PublicationEditor extends HashBrown.Entity.View.ResourceEditor.ResourceEditorBase {
    static get category() { return 'publications'; }
    
    /**
     * Constructor
     */
    constructor(params) {
        super(params);
        
        this.template = require('template/resourceEditor/publicationEditor.js');
    }
    
    /**
     * Pre render
     */
    prerender() {
        if(this.model) {
            this.state.getUrl = location.protocol + '//' + location.hostname + '/api/' + HashBrown.Context.project.id + '/' + HashBrown.Context.environment + '/publications/' + this.model.id + '/query';

            // Processor
            this.state.processorEditor = HashBrown.Entity.View.ProcessorEditor.ProcessorEditorBase.new({ model: this.model.processor || {} });
            
            this.state.processorEditor.on('change', (newValue) => {
                this.onChangeProcessor(newValue);
            });

            this.state.processorEditor.on('changealias', () => {
                this.render();
            });
           
            // Deployer
            this.state.deployerEditor = HashBrown.Entity.View.DeployerEditor.DeployerEditorBase.new({ model: this.model.deployer || {} });
            
            this.state.deployerEditor.on('change', (newValue) => {
                this.onChangeDeployer(newValue);
            });

            this.state.deployerEditor.on('changealias', () => {
                this.render();
            });
        }
    }
    
    /**
     * Fetches view data
     */
    async fetch() {
        await super.fetch();
        
        // Get content
        let allContent = await HashBrown.Entity.Resource.Content.list();

        this.state.contentOptions = {};

        for(let content of allContent) {
            this.state.contentOptions[content.getName()] = content.id;
        }
        
        // Get schemas
        this.state.schemaOptions = {};

        let allSchemas = await HashBrown.Entity.Resource.ContentSchema.list();

        for(let schema of allSchemas) {
            this.state.schemaOptions[schema.getName()] = schema.id;
        }
    }   

    /**
     * Event: Click start tour
     */
    async onClickStartTour() {
        if(location.hash.indexOf('publications/') < 0) {
            location.hash = '/publications/';
        }
       
        await new Promise((resolve) => { setTimeout(() => { resolve(); }, 500); });
            
        await UI.highlight('.navigation--resource-browser__tab[href="#/publications/"]', 'This the publications section, where you will configure how HashBrown exposes content to the outside world.', 'right', 'next');

        await UI.highlight('.panel', 'Here you will find all of your publications. You can right click here to create a new publication.', 'right', 'next');
        
        await UI.highlight('.resource-editor', 'This is the publication editor, where you edit publications.', 'left', 'next');
    }

    /**
     * Event: Change name
     */
    onChangeName(newValue) {
        this.model.name = newValue;

        this.onChange();
    }
    
    /**
     * Event: Change root content
     */
    onChangeRootContent(newValue) {
        this.model.rootContent = newValue;

        this.onChange();

        this.render();
    }
    
    /**
     * Event: Change whether root content should be included
     */
    onChangeIncludeRoot(newValue) {
        this.model.includeRoot = newValue;

        this.onChange();
    }
    
    /**
     * Event: Change allowed schemas
     */
    onChangeAllowedSchemas(newValue) {
        this.model.allowedSchemas = newValue;

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
     * Event: Change processor
     */
    onChangeProcessor(newValue) {
        if(!newValue) { return; }

        this.model.processor = newValue;

        this.onChange();
    }
    
    /**
     * Event: Click go to get url
     */
    onClickGoToGetUrl() {
        window.open(this.state.getUrl);
    }
    
    /**
     * Event: Click copy get url
     */
    onClickCopyGetUrl() {
        copyToClipboard(this.state.getUrl);

        UI.notifySmall('GET URL copied to clipboard', null, 3);
    }
}

module.exports = PublicationEditor;
