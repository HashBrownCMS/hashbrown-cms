'use strict';

/**
 * The editor for schemas
 *
 * @memberof HashBrown.Client.View.Editor
 */
class SchemaEditor extends HashBrown.View.Editor.ResourceEditor {
    static get category() { return 'schemas'; }
  
    /**
     * Fetches the model
     */
    async fetch() {
        try {
            this.model = await HashBrown.Service.SchemaService.getSchemaById(this.modelId);

            // NOTE: Temporary hack for guiding to the right editor
            if(this.model instanceof HashBrown.Entity.Resource.Schema.ContentSchema && this instanceof HashBrown.View.Editor.ContentSchemaEditor == false) {
                let editor = new HashBrown.View.Editor.ContentSchemaEditor();

                this.element.parentElement.replaceChild(editor.element, this.element);
                this.remove();
                return;
            }
            
            if(this.model instanceof HashBrown.Entity.Resource.Schema.FieldSchema && this instanceof HashBrown.View.Editor.FieldSchemaEditor == false) {
                let editor = new HashBrown.View.Editor.FieldSchemaEditor();
                
                this.element.parentElement.replaceChild(editor.element, this.element);
                this.remove();
                return;
            }

            this.allSchemas = await HashBrown.Service.SchemaService.getAllSchemas();
            this.parentSchemaOptions = {};
       
            for(let i in this.allSchemas) {
                let schema = this.allSchemas[i];

                if(schema.id !== this.model.id && schema.type === this.model.type) {
                    this.parentSchemaOptions[schema.name] = schema.id;
                }
                
                this.allSchemas[i] = await HashBrown.Service.SchemaService.getSchemaById(schema.id, true);

                if(this.model.parentSchemaId === schema.id) {
                    this.parentSchema = schema;
                }
            }

            super.fetch();

        } catch(e) {
            UI.error(e);

        }
    }

    /**
     * Welcome template
     */
    welcomeTemplate() {
        return [
            _.h1('Schemas'),
            _.p('Right click in the Schema pane to create a new Schema.'),
            _.p('Click on a Schema to edit it.'),
            _.button({class: 'widget widget--button'}, 'Import schemas')
                .click(() => {
                    let modal = UI.prompt(
                        'Import schemas',
                        'URL to uischema.org definitions',
                        'text',
                        'https://uischema.org/schemas.json',
                        async (url) => {
                            if(!url) { throw new Error('Please specify a URL'); }

                            await HashBrown.Service.RequestService.request('post', 'schemas/import?url=' + url);
                            
                            HashBrown.Service.EventService.trigger('resource');  
                        }
                    );
                })
        ];
    }

    /**
     * Gets a schema synchronously
     *
     * @param {String} id
     *
     * @return {HashBrown.Entity.Resource.Schema.SchemaBase} Schema
     */
    getSchema(id) {
        for(let schema of this.allSchemas) {
            if(schema.id === id) { return schema; }
        }

        return null;
    }

    /**
     * Event: Click advanced. Routes to the JSON editor
     */
    onClickAdvanced() {
        location.hash = '/schemas/' + this.model.id + '/json';
    }
    
    /**
     * Event: Click save
     */
    async onClickSave() {
        this.$saveBtn.toggleClass('working', true);

        await HashBrown.Service.SchemaService.setSchemaById(this.modelId, this.model);
        
        this.$saveBtn.toggleClass('working', false);
        
        // If id changed, change the hash
        if(HashBrown.Service.NavigationService.getRoute(1) != this.model.id) {
            location.hash = '/schemas/' + this.model.id;
        }
    }

    /**
     * Event: Change icon
     */
    onClickChangeIcon() {
        let modal = new HashBrown.Entity.View.Modal.PickIcon();

        modal.on('change', (newIcon) => {
            this.model.icon = newIcon;

            this.update();
        });
    }

    /**
     * Gets the schema icon
     *
     * @returns {String} Icon
     */
    getIcon() {
        if(this.model.icon) {
            return this.model.icon;
        }

        if(this.parentSchema && this.parentSchema.icon) {
            return this.parentSchema.icon;
        }

        return 'cogs';
    }

    /**
     * Renders a config editor based on a schema id
     *
     * @param {String} schemaId
     * @param {Object} config
     * @param {Boolean} onlyCustom
     *
     * @return {HTMLElement} Config editor
     */
    renderConfigEditor(schemaId, config, onlyCustom) {
        let schema = this.getSchema(schemaId);

        if(!schema || (onlyCustom && schema.parentSchemaId !== 'fieldBase')) { return null; }

        let editor = HashBrown.View.Editor.FieldEditor[schema.editorId];
          
        if(!editor) { return null; }

        return editor.renderConfigEditor.call(this, config, schema.id);
    }

    /**
     * Renders the body
     *
     * @return {HTMLElement} body
     */
    renderBody() {
        return _.div({class: 'editor__body'},
            this.field(
                { isLocked: true, label: 'Id' },
                new HashBrown.Entity.View.Widget.Text({
                    model: {
                        value: this.model.id,
                        onchange: (newValue) => { this.model.id = newValue; }
                    }
                }).element
            ),
            this.field(
                'Name',
                new HashBrown.Entity.View.Widget.Text({
                    model: {
                        value: this.model.name,
                        onchange: (newValue) => { this.model.name = newValue; }
                    }
                }).element
            ),
            this.field(
                'Icon',
                _.button({class: 'widget small widget--button fa fa-' + this.getIcon()})
                    .click(() => { this.onClickChangeIcon(); })
            ),   
            this.field(
                'Parent',
                new HashBrown.Entity.View.Widget.Popup({
                    model: {
                        value: this.model.parentSchemaId,
                        options: this.parentSchemaOptions,
                        onchange: (newParent) => {
                            this.model.parentSchemaId = newParent;
                            this.parentSchema = this.getSchema(newParent);

                            this._init();
                        }
                    }
                }).element
            )
        );
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'editor editor--schema' + (this.model.isLocked ? ' locked' : '')},
            _.div({class: 'editor__header'},
                _.span({class: 'editor__header__icon fa fa-' + this.getIcon()}),
                _.h4({class: 'editor__header__title'}, this.model.name)
            ),
            this.renderBody(),
            _.div({class: 'editor__footer'}, 
                _.div({class: 'editor__footer__buttons'},
                    _.button({class: 'widget widget--button embedded'},
                        'Advanced'
                    ).click(() => { this.onClickAdvanced(); }),
                    _.if(!this.model.isLocked,
                        this.$saveBtn = _.button({class: 'widget widget--button editor__footer__buttons__save'},
                            _.span({class: 'widget--button__text-default'}, 'Save '),
                            _.span({class: 'widget--button__text-working'}, 'Saving ')
                        ).click(() => { this.onClickSave(); })
                    )
                )
            )
        );
    }
}

module.exports = SchemaEditor;
