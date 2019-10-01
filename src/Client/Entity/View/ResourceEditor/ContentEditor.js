'use strict';

/**
 * The editor for content resources
 */
class ContentEditor extends HashBrown.Entity.View.ResourceEditor.ResourceEditorBase {
    static get itemType() { return HashBrown.Entity.Resource.Content; }
    
    /**
     * Constructor
     */
    constructor(params) {
        super(params);
        
        HashBrown.Service.EventService.on('language', 'resourceEditor', (id) => { this.onChangeLanguage(); });
        HashBrown.Service.EventService.on('settings', 'resourceEditor', (id) => { this.onChangeContentSettings(id); });

        this.template = require('template/resourceEditor/contentEditor.js');
    }

    /**
     * Fetches the model
     */
    async fetch() {
        await super.fetch();

        if(this.state.name) { return; }

        this.state.schema = await HashBrown.Service.SchemaService.getSchemaById(this.model.schemaId, true);

        this.state.publishing = await this.model.getSettings('publishing') || {};

        if(this.state.publishing.connectionId) {
            this.state.connection = await HashBrown.Service.ConnectionService.getConnectionById(this.state.publishing.connectionId); 
        }

        this.state.icon = this.state.schema.icon;
        this.state.title = this.model.prop('title', HashBrown.Context.language) || this.model.id;

        this.state.tab = HashBrown.Service.NavigationService.getRoute(2) || this.state.schema.defaultTabId || 'meta';
        this.state.tabs = this.state.schema.tabs || {};

        this.state.tabs['meta'] = 'Meta';

        this.state.fields = [];

        let contentFields = {};
        let schemaFields = {};

        if(this.state.tab === 'meta') {
            schemaFields = JSON.parse(JSON.stringify(this.state.schema.fields));
            delete schemaFields['properties'];
            
            contentFields = JSON.parse(JSON.stringify(this.model));
            delete contentFields['properties'];
        
        } else {
            for(let key in this.state.schema.fields.properties) {
                let definition = this.state.schema.fields.properties[key];

                if(definition.tabId !== this.state.tab) { continue; }
            
                schemaFields[key] = this.state.schema.fields.properties[key];
            }

            contentFields = this.model.properties;

        }

        for(let key in schemaFields) {
            let field = await HashBrown.Entity.View.Field.FieldBase.createFromFieldDefinition(
                schemaFields[key],
                contentFields[key]
            );

            field.model.isDisabled = this.model.isLocked;

            if(this.state.tab === 'meta') {
                field.on('change', (newValue) => {  
                    this.model[key] = newValue;
                    this.trigger('change', this.model);
                });
            
            } else {
                field.on('change', (newValue) => {  
                    this.model.properties[key] = newValue;
                    this.trigger('change', this.model);
                });
            }

            this.state.fields.push(field); 
        }
    }

    /**
     * Update
     */
    async update() {
        // Cache field states
        let fieldStates = {};

        for(let field of this.state.fields || []) {
            fieldStates[field.model.key] = field.state;
        }

        super.update();

        // Restore field states
        for(let field of this.state.fields || []) {
            let state = fieldStates[field.model.key];

            if(!state) { continue; }

            field.state.isCollapsed = state.isCollapsed;
            field.render();
        }
    }

    /**
     * Event: Clicked start tour
     */
    onClickStartTour() {
        HashBrown.Service.ContentService.startTour();
    }

    /**
     * Event: Click example content
     */
    onClickExampleContent() {
        UI.confirm(
            'Example content',
            'Do you want to load some example content? This could overwrite existing schemas',
            async () => {
                await HashBrown.Service.RequestService.request('post', 'content/example');
            
                HashBrown.Service.EventService.trigger('resource');
                
                UI.notifySmall('Example content loaded successfully', null, 3);
            }
        );
    }

    /**
     * Event: Content settings changed
     *
     * @param {String} id
     */
    onChangeContentSettings(id) {
        if(this.model.id !== id) { return; }

        UI.confirm(
            'Content settings changed',
            'The content you are currently editing has been changed. Do you want to reload it?',
            () => { this.update(); }
        );
    }

    /**
     * Event: Click save
     */
    async onClickSave() {
        await HashBrown.Service.ContentService.setContentById(this.state.id, this.model);

        let publishedCheckbox = this.namedElements.published;
        let shouldPublish = publishedCheckbox ? publishedCheckbox.model.value : false;

        // Unpublish
        if(this.state.connection && !shouldPublish) {
            await HashBrown.Service.RequestService.request('post', 'content/unpublish', this.model);
           
            if(this.model.isPublished) {
                UI.notifySmall(`"${this.state.title}" unpublished successfully`, null, 3);
            } else {
                UI.notifySmall(`"${this.state.title}" saved successfully`, null, 3);
            }

        // Publish
        } else if(this.state.connection && shouldPublish) {
            await HashBrown.Service.RequestService.request('post', 'content/publish', this.model);

            UI.notifySmall(`"${this.state.title}" published successfully`, null, 3);
        
        // No change made to publishing
        } else {
            UI.notifySmall(`"${this.state.title}" saved successfully`, null, 3);

        }
    }

    /**
     * Event: Language changed
     */
    onChangeLanguage() {
        this.update(); 
    }
    
    /**
     * Event: Click new
     */
    async onClickNew() {
        new HashBrown.Entity.View.Modal.CreateContent();
    }
}

module.exports = ContentEditor;
