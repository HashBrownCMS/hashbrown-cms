'use strict';

/**
 * A field for managing lists of other fields
 *
 * @memberof HashBrown.Client.Entity.View.Field
 */
class ArrayEditor extends HashBrown.Entity.View.Field.FieldBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.editorTemplate = require('template/field/editor/arrayEditor');
        this.configTemplate = require('template/field/config/arrayEditor');
    }

    /**
     * Gets tools for this field
     *
     * @return {Array} Tools
     */
    getTools() {
        if(this.state.name === 'config') { return []; }

        if(this.state.name === 'sorting') {
            return [
                {
                    icon: 'check',
                    tooltip: 'Done sorting items',
                    handler: () => this.onClickDoneSortingItems()
                }
            ];
        }

        return [
            {
                icon: 'sort',
                tooltip: 'Sort items',
                handler: () => this.onClickSortItems()
            },
            {
                icon: 'expand',
                tooltip: 'Expand all items',
                handler: () => this.onClickExpandItems()
            },
            {
                icon: 'compress',
                tooltip: 'Collapse all items',
                handler: () => this.onClickCollapseItems()
            }
        ];
    }

    /**
     * Fetches view data
     */
    async fetch() {
        if(this.state.name === 'config') {
            // Build schema options
            this.state.schemaOptions = {};

            for(let schema of await HashBrown.Service.SchemaService.getAllSchemas('field') || []) {
                this.state.schemaOptions[schema.name] = schema.id;
            }

        } else {
            // Build schema options
            this.state.schemaOptions = {};

            for(let schemaId of this.model.config.allowedSchemas || []) {
                let schema = await HashBrown.Service.SchemaService.getSchemaById(schemaId);

                this.state.schemaOptions[schema.name] = schema.id;
            }

            // Build fields
            this.state.fields = [];

            if(!Array.isArray(this.state.value)) { this.state.value = []; }

            for(let i = 0; i < this.state.value.length; i++) {
                let item = this.state.value[i];

                let view = await HashBrown.Entity.View.Field.FieldBase.createFromSchemaId(
                    item.schemaId,
                    item.value
                );
                
                view.on('change', (newValue) => {
                    item.value = newValue;
                    this.state.value[i] = item;

                    this.trigger('change', this.state.value);
                });

                this.state.fields.push({
                    view: view,
                    label: view.state.label
                }); 
            }
            
            // Set state limitations
            this.state.canRemoveItems = !this.model.config.minItems || this.state.value.length > this.model.config.minItems;
            this.state.canAddItems = !this.model.config.maxItems || this.state.value.length < this.model.config.maxItems;
        }
    }

    /**
     * Event: Click collapse items
     */
    onClickCollapseItems() {
        for(let field of this.state.fields || []) {
            field.view.state.isCollapsed = true;
            field.view.render();
        }
    }
    
    /**
     * Event: Click expand items
     */
    onClickExpandItems() {
        for(let field of this.state.fields || []) {
            field.view.state.isCollapsed = false;
            field.view.render();
        }
    }
    
    /**
     * Event: Click sort items
     */
    onClickSortItems() {
        this.state.name = 'sorting'; 
    
        this.update();
    }

    /**
     * Event: Click done sorting
     */
    onClickDoneSortingItems() {
        this.state.name = undefined;
    
        this.update();
    }

    /**
     * Event: Click remove item
     *
     * @param {Number} index
     */
    onClickRemoveItem(index) {
        if(index < 0 || index >= this.state.value.length) { return; }
        if(!this.state.canRemoveItems) { return; }

        this.state.value.splice(index, 1);

        this.onChange(this.state.value);

        this.update();
    }

    /**
     * Event: Click add item
     *
     * @param {String} schemaId
     */
    onClickAddItem(schemaId) {
        if(!schemaId) { return; }
        if(!this.state.canAddItems) { return; }

        this.state.value.push({
            schemaId: schemaId,
            value: null
        });

        this.onChange(this.state.value);

        this.update();
    }
    
    /**
     * Event: Change schema
     */
    onChangeItemSchema(index, schemaId) {
        if(!this.state.value || index >= this.state.value.length) { return; }

        if(!this.state.value[index]) {
            this.state.value[index] = {};
        }
            
        this.state.value[index].schemaId = schemaId;

        this.onChange(this.state.value);

        this.update();
    }

    /**
     * Event: Change sorting
     */
    onChangeItemSorting(fields) {
        this.state.value = [];

        for(let field of fields || []) {
            this.state.value.push({
                schemaId: field.view.model.schema.id,
                value: field.view.state.value
            });
        }
        
        this.onChange(this.state.value);
    }
}

module.exports = ArrayEditor;
