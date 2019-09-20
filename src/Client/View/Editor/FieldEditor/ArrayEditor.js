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
 * @memberof HashBrown.Client.View.Editor.FieldEditor
 */
class ArrayEditor extends HashBrown.View.Editor.FieldEditor.FieldEditor {
    /**
     * Event: Click add item
     */
    onClickAddItem() {
        let index = this.value.length;

        if(this.config.maxItems && index >= this.config.maxItems) {
            UI.notify('Item maximum reached', 'You  can maximum add ' + this.config.maxItems + ' items here');
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
     * Fetches the model
     */
    async fetch() {
        this.schemaOptions = {};

        for(let schemaId of this.config.allowedSchemas || []) {
            if(!schemaId) { continue; }

            let schema = await HashBrown.Service.SchemaService.getSchemaById(schemaId);

            this.schemaOptions[schema.name] = schema.id;
        }

        super.fetch(); 
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
                HashBrown.Service.UIService.fieldSortableArray(
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
                new HashBrown.Entity.View.Widget.Number({
                    model: {
                        min: 0,
                        step: 1,
                        value: config.minItems || 0,
                        onchange: (newValue) => { config.minItems = newValue; }
                    }
                }).element
            ),
            this.field(
                'Max items',
                new HashBrown.Entity.View.Widget.Number({
                    model: {
                        min: 0,
                        step: 1,
                        value: config.maxItems || 0,
                        onchange: (newValue) => { config.maxItems = newValue; }
                    }
                }).element
            ),
            this.field(
                'Allowed schemas',
                new HashBrown.Entity.View.Widget.Popup({
                    model: {
                        multiple: true,
                        autocomplete: true,
                        tooltip: 'A list of schemas that can be part of this array',
                        value: config.allowedSchemas,
                        clearable: true,
                        options: (async () => { 
                            let schemas = await HashBrown.Service.SchemaService.getAllSchemas('field');
                            let options = {};

                            for(let schema of schemas) {
                                options[schema.name] = schema.id;
                            }

                            return options;
                        })(),
                        onchange: (newValue) => { config.allowedSchemas = newValue; }
                    }
                }).element
            ),
            this.field(
                'Is grid',
                new HashBrown.Entity.View.Widget.Checkbox({
                    model: {
                        value: config.isGrid,
                        onchange: (newValue) => { config.isGrid = newValue; }
                    }
                }).element
            )
        ];
    }

    /**
     * Sanity check
     */
    sanityCheck() {
        // Config
        this.config = this.config || {};

        // Sanity check for allowed Schema array
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
                return UI.error(new Error('The type "' + typeof this.value + '" of the value is incorrect or corrupted'));
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
            schema = await HashBrown.Service.SchemaService.getSchemaById(item.schemaId, true);
        }

        // Schema could not be found, assign first allowed Schema
        if(!schema) {
            schema = await HashBrown.Service.SchemaService.getSchemaById(this.config.allowedSchemas[0], true);
            item.schemaId = schema.id;
        }

        if(!schema) { throw new Error('Item #' + i + ' has no available Schema'); }

        // Obtain the field editor
        let fieldEditor = HashBrown.View.Editor.FieldEditor[schema.editorId];

        if(!fieldEditor) { throw new Error('The field editor "' + schema.editorId + '" for Schema "' + schema.name + '" was not found'); }

        // Perform sanity check on item value
        item.value = HashBrown.Service.ContentService.fieldSanityCheck(item.value, schema);

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
                    Schema: new HashBrown.Entity.View.Widget.Popup({
                        model: {
                            value: item.schemaId,
                            placeholder: 'Schema',
                            autocomplete: true,
                            options: this.schemaOptions,
                            onchange: (newSchemaId) => { this.onChangeItemSchema(newSchemaId, item); }
                        }
                    }).element
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
            
            item.value = newValue;

            this.trigger('change', this.value);
        });

        editorInstance.on('silentchange', (newValue) => {
            $label.html(editorInstance.getFieldLabel());
            
            item.value = newValue;
            
            this.trigger('silentchange', this.value);
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
            _.button({title: 'Add an item', class: 'editor__field__add widget widget--button dashed embedded expanded'},
                _.span({class: 'fa fa-plus'}), 
                'Add item'
            ).click(() => { this.onClickAddItem() })
        );
    }    
}

module.exports = ArrayEditor;
