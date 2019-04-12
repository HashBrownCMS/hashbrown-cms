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
     * Constructor
     */
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Fetches the model
     */
    async fetch() {
        this.allowedSchemas = [];
      
        for(let schemaId of this.config.allowedSchemas || []) {
            if(!schemaId) { continue; }
            
            try {
                let schema = await HashBrown.Helpers.SchemaHelper.getSchemaById(schemaId, true);

                this.allowedSchemas.push(schema);

            } catch(e) {
                debug.log(e.message, this);

            }
        }

        super.fetch();
    }

    /**
     * Gets a schema from the list of allowed schemas
     *
     * @param {String} id
     *
     * @return {FieldSchema} Schema
     */
    getAllowedSchema(id) {
        checkParam(id, 'id', String);

        for(let schema of this.allowedSchemas) {
            if(schema.id === id) { return schema; }
        }

        return null;
    }

    /**
     * Render key actions
     *
     * @returns {HTMLElement} Actions
     */
    renderKeyActions() {
        if(this.config.isGrid) { return; }

        return [
            _.button({class: 'editor__field__key__action editor__field__key__action--sort'})
                .click((e) => {
                    HashBrown.Helpers.UIHelper.fieldSortableArray(
                        this.value,
                        this.element.parentElement,
                        (newArray) => {
                            this.value = newArray;

                            this.trigger('change', this.value);
                        }
                    );
                }),
            _.button({class: 'editor__field__key__action editor__field__key__action--collapse'}, 'Collapse all')
                .click((e) => {
                    Array.from(this.element.children).forEach((field) => {
                        field.classList.toggle('collapsed', true);
                    });
                }),
            _.button({class: 'editor__field__key__action editor__field__key__action--expand'}, 'Expand all')
                .click((e) => {
                    Array.from(this.element.children).forEach((field) => {
                        field.classList.toggle('collapsed', false);
                    });
                })
        ];
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
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Min items'),
                _.div({class: 'editor__field__value'},
                    new HashBrown.Views.Widgets.Input({
                        type: 'number',
                        min: 0,
                        step: 1,
                        tooltip: 'How many items are required in this array (0 is unlimited)',
                        value: config.minItems || 0,
                        onChange: (newValue) => { config.minItems = newValue; }
                    }).$element
                )
            ),
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Max items'),
                _.div({class: 'editor__field__value'},
                    new HashBrown.Views.Widgets.Input({
                        type: 'number',
                        min: 0,
                        step: 1,
                        tooltip: 'How many items are allowed in this array (0 is unlimited)',
                        value: config.maxItems || 0,
                        onChange: (newValue) => { config.maxItems = newValue; }
                    }).$element
                )
            ),
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Allowed Schemas'),
                _.div({class: 'editor__field__value'},
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
                    }).$element
                )
            ),
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Is grid'),
                _.div({class: 'editor__field__value'},
                    new HashBrown.Views.Widgets.Input({
                        type: 'checkbox',
                        tooltip: 'When enabled, the array items will display as a grid',
                        value: config.isGrid,
                        onChange: (newValue) => { config.isGrid = newValue; }
                    }).$element
                )
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
     * Gets the label of an item
     *
     * @param {Object} item
     * @param {Schema} schema
     *
     * @return {String} Label
     */
    getItemLabel(item, schema) {
        let label = '';
        
        // Use the schema config
        if(schema.config && schema.config.label && item.value && item.value[schema.config.label]) {
            label = item.value[schema.config.label];

        // Or try the value as a string
        } else if(item.value !== null && item.value !== undefined && typeof item.value === 'string' || typeof item.value === 'number') {
            label = (item.value || '').toString();

        // Or use the schema name
        } else {
            label = schema.name;
        
        }

        // Strip HTML
        label = new DOMParser().parseFromString(label, 'text/html').body.textContent || '';

        // Limit characters
        if(label.length > 80) {
            label = label.substring(0, 77) + '...';
        }

        return label;
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'field-editor field-editor--array ' + (this.config.isGrid ? 'grid' : '')},
            _.each(this.value, (i, item) => {
                // Render field
                let $field = _.div({class: 'editor__field field-editor--array__item collapsible collapsed'});

                let renderField = () => {
                    let schema = this.getAllowedSchema(item.schemaId);

                    // Schema could not be found, assign first allowed Schema
                    if(!schema) {
                        schema = this.allowedSchemas[0];
                        item.schemaId = schema.id;
                    }

                    if(!schema) {
                        UI.errorModal(new Error('Item #' + i + ' has no available Schemas'));
                        $field = null;
                        return;
                    }

                    // Obtain the field editor
                    if(schema.editorId.indexOf('Editor') < 0) {
                        schema.editorId = schema.editorId[0].toUpperCase() + schema.editorId.substring(1) + 'Editor';
                    }
                    
                    let editorClass = HashBrown.Views.Editors.FieldEditors[schema.editorId];

                    if(!editorClass) {
                        UI.errorModal(new Error('The field editor "' + schema.editorId + '" for Schema "' + schema.name + '" was not found'));    
                        $field = null;
                        return;
                    }
                    
                    // Perform sanity check on item value
                    item.value = HashBrown.Helpers.ContentHelper.fieldSanityCheck(item.value, schema);

                    // Init the field editor
                    let editorInstance = new editorClass({
                        value: item.value,
                        config: schema.config,
                        schema: schema,
                        className: 'editor__field__value'
                    });

                    // Hook up the change event
                    editorInstance.on('change', (newValue) => {
                        item.value = newValue;
                        
                        let key = $field[0].children[0];

                        key.querySelector('.editor__field__key__label').innerHTML = this.getItemLabel(item, schema);
                        key.querySelector('.editor__field__key__actions .fa-remove').title = 'Remove "' + this.getItemLabel(item, schema) + '"';
                    });
                    
                    editorInstance.on('silentchange', (newValue) => {
                        item.value = newValue;

                        let key = $field[0].children[0];
                        
                        key.querySelector('.editor__field__key__label').innerHTML = this.getItemLabel(item, schema);
                        key.querySelector('.editor__field__key__actions .fa-remove').title = 'Remove "' + this.getItemLabel(item, schema) + '"';
                    });

                    _.append($field.empty(),
                        // Render field key
                        _.div({class: 'editor__field__key'},
                            _.div({class: 'editor__field__key__label'}, this.getItemLabel(item, schema))
                                .click((e) => {
                                    e.currentTarget.parentElement.parentElement.classList.toggle('collapsed');  
                                }),
                            _.div({class: 'editor__field__key__actions'},
                                _.button({class: 'widget widget--button small embedded fa fa-remove', title: 'Remove "' + this.getItemLabel(item, schema) + '"'})
                                    .click(() => {
                                        this.value.splice(i, 1);
                                
                                        this.trigger('change', this.value);

                                        this.fetch();
                                    })
                            )
                        ),

                        // Render Schema picker
                        _.if(this.allowedSchemas.length > 1,
                            _.div({class: 'editor__field__toolbar'},
                                _.div({class: 'editor__field__toolbar__label'}, 'Schema'),
                                new HashBrown.Views.Widgets.Dropdown({
                                    className: 'editor__field__toolbar__widget',
                                    value: item.schemaId,
                                    placeholder: 'Schema',
                                    valueKey: 'id',
                                    labelKey: 'name',
                                    iconKey: 'icon',
                                    options: this.allowedSchemas,
                                    onChange: (newSchemaId) => {
                                        if(newSchemaId === item.schemaId) { return; }

                                        item.schemaId = newSchemaId;
                                        item.value = null;
                                        
                                        renderField();

                                        this.trigger('change', this.value);
                                    }
                                }).$element
                            )
                        ),
                
                        // Render field editor instance
                        editorInstance.$element
                    );
                };

                renderField();

                return $field;
            }),
            _.button({title: 'Add an item', class: 'editor__field__add widget widget--button round fa fa-plus'})
                .click(async () => {
                    let index = this.value.length;

                    if(this.config.maxItems && index >= this.config.maxItems) {
                        UI.messageModal('Item maximum reached', 'You  can maximum add ' + this.config.maxItems + ' items here');
                        return;
                    }

                    this.value[index] = { value: null, schemaId: null };

                    this.trigger('change', this.value);

                    await this.fetch();
                    
                    // Restore the scroll position
                    HashBrown.Views.Editors.ContentEditor.restoreScrollPos(100);
                })
        );
    }    
}

module.exports = ArrayEditor;
