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
        this.state.getUrl = location.protocol + '//' + location.hostname + '/api/' + HashBrown.Context.project.id + '/' + HashBrown.Context.environment + '/publications/' + this.model.id + '/query';
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
        this.state.schemaOptions = [];

        let allSchemas = await HashBrown.Entity.Resource.ContentSchema.list();

        for(let schema of allSchemas) {
            this.state.schemaOptions[schema.getName()] = schema.id;
        }
        
        // Get processor options
        this.state.processorOptions = {};
        
        let processors = await HashBrown.Service.RequestService.request('get', 'publications/processors');

        for(let alias in processors) {
            this.state.processorOptions[processors[alias]] = alias;
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
    }
    
    /**
     * Event: Change allowed schemas
     */
    onChangeAllowedSchemas(newValue) {
        this.model.allowedSchemas = newValue;

        this.onChange();
    }
    
    /**
     * Event: Change processor
     */
    onChangeProcessor(newValue) {
        if(!newValue) { return; }

        this.model.processorAlias = newValue;

        this.onChange();
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
