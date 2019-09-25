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
            schemaFields = this.state.schema.fields.properties;
            contentFields = this.model.properties;

        }

        for(let key in schemaFields) {
            let schemaField = schemaFields[key];
            let fieldSchema = await HashBrown.Service.SchemaService.getSchemaById(schemaField.schemaId, true);
            let fieldType = HashBrown.Entity.View.Field[fieldSchema.editorId] || HashBrown.Entity.View.Field.FieldBase;
            let fieldValue = contentFields[key];

            let field = new fieldType({
                model: {
                    isMultilingual: schemaField.multilingual,
                    isDisabled: schemaField.disabled,
                    config: schemaField.config || {},
                    key: key, 
                    label: schemaField.label,
                    schema: fieldSchema,
                    value: contentFields[key]
                }
            });

            field.on('change', (newValue) => {  
                if(this.state.tab === 'meta') {
                    this.model[key] = newValue;
                } else {
                    this.model.properties[key] = newValue;
                }

                this.trigger('change', this.model);
            });

            this.state.fields.push(field); 
        }
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

        await this.update();
    }

    /**
     * Event: Language changed
     */
    onChangeLanguage() {
        this.update(); 
    }
}

module.exports = ContentEditor;
