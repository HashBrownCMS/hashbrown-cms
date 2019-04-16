'use strict';

/**
 * The editor for schemas
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class SchemaEditor extends HashBrown.Views.Editors.Editor {
    /**
     * Fetches the model
     */
    async fetch() {
        try {
            this.allSchemas = await HashBrown.Helpers.SchemaHelper.getAllSchemas();
       
            for(let i in this.allSchemas) {
                let id = this.allSchemas[i].id;
                
                this.allSchemas[i] = await HashBrown.Helpers.SchemaHelper.getSchemaById(id, true);

                if(this.model.parentSchemaId === id) {
                    this.parentSchema = this.allSchemas[i];
                }
            }

            super.fetch();

        } catch(e) {
            UI.errorModal(e);

        }
    }

    /**
     * Gets a schema synchronously
     *
     * @param {String} id
     *
     * @return {HashBrown.Models.Schema} Schema
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
        location.hash = location.hash.replace('/schemas/', '/schemas/json/');
    }
    
    /**
     * Event: Click save
     */
    async onClickSave() {
        this.$saveBtn.toggleClass('working', true);

        await HashBrown.Helpers.ResourceHelper.set('schemas', this.modelId, this.model);
        
        this.$saveBtn.toggleClass('working', false);
        
        // If id changed, change the hash
        if(Crisp.Router.params.id != this.model.id) {
            location.hash = '/schemas/' + this.model.id;
        }
    }

    /**
     * Event: Change icon
     */
    onClickChangeIcon() {
        let modal = new HashBrown.Views.Modals.IconModal();

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

        let editor = HashBrown.Views.Editors.FieldEditors[schema.editorId];
          
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
                new HashBrown.Views.Widgets.Input({
                    value: this.model.id,
                    onChange: (newValue) => { this.model.id = newValue; }
                })
            ),
            this.field(
                'Name',
                new HashBrown.Views.Widgets.Input({
                    value: this.model.name,
                    onChange: (newValue) => { this.model.name = newValue; }
                })
            ),
            this.field(
                'Icon',
                _.button({class: 'widget small widget--button fa fa-' + this.getIcon()})
                    .click(() => { this.onClickChangeIcon(); })
            ),   
            this.field(
                'Parent',
                new HashBrown.Views.Widgets.Dropdown({
                    value: this.model.parentSchemaId,
                    options: HashBrown.Helpers.SchemaHelper.getAllSchemas(this.model.type),
                    valueKey: 'id',
                    labelKey: 'name',
                    disabledOptions: [ { id: this.model.id, name: this.model.name } ],
                    onChange: (newParent) => {
                        this.model.parentSchemaId = newParent;

                        this.fetch();
                    }
                })
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
