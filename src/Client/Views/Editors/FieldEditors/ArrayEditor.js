'use strict';

/**
 * An array editor for editing a list of other field values
 *
 * @description Example:
 * <pre>
 * {
 *     "myArray": {
 *         "label": "My array",
 *         "tabId": "content",
 *         "schemaId": "array",
 *         "config": {
 *             "allowedSchemas": [ "string", "mediaReference", "myCustomSchema" ],
 *             "minItems": 5,
 *             "maxItems": 5
 *         }
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */
class ArrayEditor extends HashBrown.Views.Editors.FieldEditors.FieldEditor {
    /**
     * Event: Click add item
     */
    onClickAddItem() {
        let index = this.value.length;

        if(this.config.maxItems && index >= this.config.maxItems) {
            UI.messageModal('Item maximum reached', 'You  can maximum add ' + this.config.maxItems + ' items here');
            return;
        }

        this.value[index] = { value: null, schemaId: null };

        this.trigger('change', this.value);

        this.update();
    }

    /**
     * Event: Change item schema
     *
     * @param {String} newSchemaId
     * @param {Object} item
     */
    onChangeItemSchema(newSchemaId, item) {
        if(newSchemaId === item.schemaId) { return; }

        item.schemaId = newSchemaId;
        item.value = null;

        this.trigger('change', this.value);
        
        this.update();
    }

    /**
     * Event: Click remove item
     *
     * @param {Number} index
     */
    onClickRemoveItem(index) {
        this.value.splice(index, 1);

        this.trigger('change', this.value);

        this.element.removeChild(this.element.children[index]);
    }

    /**
     * Gets all allowed schemas
     *
     * @return {Array} Schemas
     */
    async getAllowedSchemas() {
        let allowedSchemas = [];

        for(let schemaId of this.config.allowedSchemas) {
            if(!schemaId) { continue; }

            let schema = await HashBrown.Helpers.SchemaHelper.getSchemaById(schemaId);

            allowedSchemas.push(schema);
        }

        return allowedSchemas;
    }

    /**
     * Updates this view
     */
    update() {
        this._expandedItems = [];

        for(let i = 0; i < this.element.children.length; i++) {
            if(!this.element.children[i].classList.contains('collapsed')) {
                this._expandedItems.push(i);
            }
        }
        
        super.update();
    }

    /**
     * Gets whether an item is expandend (used when reloading the view)
     *
     * @param {Number} index
     *
     * @return {Boolean} Is expanded
     */
    isItemExpanded(index) {
        checkParam(index, 'index', Number, true);

        if(!this._expandedItems) { return false; }

        return this._expandedItems.indexOf(index) > -1;
    }
    
    /**
     * Render key actions
     *
     * @returns {HTMLElement} Actions
     */
    getKeyActions() {
        if(this.config.isGrid) { return; }

        return {
            sort: () => {
                HashBrown.Helpers.UIHelper.fieldSortableArray(
                    this.value,
                    this.element.parentElement,
                    (newArray) => {
                        this.value = newArray;
                
                        this.trigger('change', this.value);
                    }
                );
            },
            collapse: () => {
                Array.from(this.element.children).forEach((field) => {
                    field.classList.toggle('collapsed', true);
                });
            },
            expand: () => {
                Array.from(this.element.children).forEach((field) => {
                    field.classList.toggle('collapsed', false);
                });
            }
        };
    }

    /**
     * Renders the config editor
     *
     * @param {Object} config
     *
     * @returns {HTMLElement} Element
     */
    static renderConfigEditor(config) {
        return [
            this.field(
                'Min items',
                new HashBrown.Views.Widgets.Input({
                    type: 'number',
                    min: 0,
                    step: 1,
                    tooltip: 'How many items are required in this array (0 is unlimited)',
                    value: config.minItems || 0,
                    onChange: (newValue) => { config.minItems = newValue; }
                })
            ),
            this.field(
                'Max items',
                new HashBrown.Views.Widgets.Input({
                    type: 'number',
                    min: 0,
                    step: 1,
                    tooltip: 'How many items are allowed in this array (0 is unlimited)',
                    value: config.maxItems || 0,
                    onChange: (newValue) => { config.maxItems = newValue; }
                })
            ),
            this.field(
                'Allowed Schemas',
                new HashBrown.Views.Widgets.Dropdown({
                    useMultiple: true,
                    useTypeAhead: true,
                    labelKey: 'name',
                    tooltip: 'A list of schemas that can be part of this array',
                    valueKey: 'id',
                    value: config.allowedSchemas,
                    useClearButton: true,
                    options: HashBrown.Helpers.SchemaHelper.getAllSchemas('field'),
                    onChange: (newValue) => { config.allowedSchemas = newValue; }
                })
            ),
            this.field(
                'Is grid',
                new HashBrown.Views.Widgets.Input({
                    type: 'checkbox',
                    tooltip: 'When enabled, the array items will display as a grid',
                    value: config.isGrid,
                    onChange: (newValue) => { config.isGrid = newValue; }
                })
            )
        ];
    }

    /**
     * Sanity check
     */
    sanityCheck() {
        // Config
        this.config = this.config || {};

        // Sanity check for allowed Schemas array
        this.config.allowedSchemas = this.config.allowedSchemas || [];
        
        // The value was null
        if(!this.value) {
            this.value = [];
            
            setTimeout(() => {
                this.trigger('silentchange', this.value);
            }, 500);
        
        // The value was not an array, recover the items
        } else if(!Array.isArray(this.value)) {
            debug.log('Restructuring array from old format...', this);

            // If this value isn't using the old system, we can't recover it
            if(!Array.isArray(this.value.items) || !Array.isArray(this.value.schemaBindings)) {
                return UI.errorModal(new Error('The type "' + typeof this.value + '" of the value is incorrect or corrupted'));
            }

            let newItems = [];

            // Restructure "items" array into objects
            for(let i in this.value.items) {
                newItems[i] = {
                    value: this.value.items[i]
                };
            
                // Try to get the Schema id
                if(this.value.schemaBindings[i]) {
                    newItems[i].schemaId = this.value.schemaBindings[i];

                // If we couldn't find it, just use the first allowed Schema
                } else {
                    newItems[i].schemaId = this.config.allowedSchemas[0];

                }
            }

            this.value = newItems;
    
            setTimeout(() => {
                this.trigger('silentchange', this.value);
            }, 500);
        }

        // The value was below the required amount
        if(this.value.length < this.config.minItems) {
            let diff = this.config.minItems - this.value.length;

            for(let i = 0; i < diff; i++) {
                this.value.push({ value: null, schemaId: null });
            }
        }

        // The value was above the required amount
        if(this.value.length > this.config.maxItems) {
            for(let i = this.config.maxItems; i < this.value.length; i++) {
                delete this.value[i];
            }
        }
    }

    /**
     * Pre render
     */
    prerender() {
        this.sanityCheck();
    }

    /**
     * Renders an array item
     *
     * @param {HTMLElement} placeholder
     * @param {Object} item
     * @param {Number} index
     */
    async renderItem($placeholder, item, index) {
        let schema = null;

        if(item.schemaId) {
            schema = await HashBrown.Helpers.SchemaHelper.getSchemaById(item.schemaId, true);
        }

        // Schema could not be found, assign first allowed Schema
        if(!schema) {
            schema = await HashBrown.Helpers.SchemaHelper.getSchemaById(this.config.allowedSchemas[0]);
            item.schemaId = schema.id;
        }

        if(!schema) { throw new Error('Item #' + i + ' has no available Schemas'); }

        // Obtain the field editor
        let fieldEditor = HashBrown.Views.Editors.FieldEditors[schema.editorId];

        if(!fieldEditor) { throw new Error('The field editor "' + schema.editorId + '" for Schema "' + schema.name + '" was not found'); }

        // Perform sanity check on item value
        item.value = HashBrown.Helpers.ContentHelper.fieldSanityCheck(item.value, schema);

        // Init the field editor
        let editorInstance = new fieldEditor({
            value: item.value,
            config: schema.config,
            schema: schema,
            className: 'editor__field__value'
        });

        let $field = this.field(
            {
                isCollapsible: true,
                isCollapsed: !this.isItemExpanded(index),
                label: editorInstance.getFieldLabel(),
                actions: {
                    remove: () => { this.onClickRemoveItem(index); }
                },
                toolbar: {
                    Schema: new HashBrown.Views.Widgets.Dropdown({
                        className: 'editor__field__toolbar__widget',
                        value: item.schemaId,
                        placeholder: 'Schema',
                        valueKey: 'id',
                        labelKey: 'name',
                        iconKey: 'icon',
                        options: this.getAllowedSchemas(),
                        onChange: (newSchemaId) => { this.onChangeItemSchema(newSchemaId, item); }
                    })
                }
            },

            // Render field editor instance
            editorInstance
        );

        let $label = $field.children('.editor__field__key').children('.editor__field__key__label');

        // Hook up the ready event
        editorInstance.on('ready', () => {
            $label.html(editorInstance.getFieldLabel());
        });

        // Hook up the change event
        editorInstance.on('change', (newValue) => {
            $label.html(editorInstance.getFieldLabel());
        });

        editorInstance.on('silentchange', (newValue) => {
            $label.html(editorInstance.getFieldLabel());
        });

        $placeholder.replaceWith($field);
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'field-editor field-editor--array ' + (this.config.isGrid ? 'grid' : '')},
            _.each(this.value, (i, item) => {
                if(!item) { return; }

                let $placeholder = _.div({class: 'editor__field loading'});

                this.renderItem($placeholder, item, parseInt(i));

                return $placeholder;
            }),
            _.button({title: 'Add an item', class: 'editor__field__add widget widget--button round fa fa-plus'})
                .click(() => { this.onClickAddItem() })
        );
    }    
}

module.exports = ArrayEditor;
