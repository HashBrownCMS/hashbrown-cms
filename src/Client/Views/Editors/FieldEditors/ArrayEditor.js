'use strict';

const FieldEditor = require('./FieldEditor');
const SchemaHelper = require('Client/Helpers/SchemaHelper');
const MediaHelper = require('Client/Helpers/MediaHelper');
const ContentHelper = require('Client/Helpers/ContentHelper');
const ContentEditor = require('Client/Views/Editors/ContentEditor');

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
class ArrayEditor extends FieldEditor {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.fetch();
    }
   
    /**
     * Render key actions
     *
     * @returns {HTMLElement} Actions
     */
    renderKeyActions() {
        if(!this.value || this.value.length < 1) { return; }

        return [
            _.button({class: 'editor__field__key__action editor__field__key__action--sort'})
                .click((e) => {
                    HashBrown.Helpers.UIHelper.fieldSortableArray(
                        this.value,
                        $(e.currentTarget).parents('.editor__field')[0],
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
                        labelKey: 'name',
                        valueKey: 'id',
                        value: config.allowedSchemas,
                        useClearButton: true,
                        options: HashBrown.Helpers.SchemaHelper.getAllSchemasSync('field'),
                        onChange: (newValue) => { config.allowedSchemas = newValue; }
                    }).$element
                )
            )
        ];
    }

    /**
     * Sanity check
     */
    sanityCheck() {
        // The value was null
        if(!this.value) { this.value = []; }

        // Config
        this.config = this.config || {};

        // Sanity check for allowed Schemas array
        this.config.allowedSchemas = this.config.allowedSchemas || [];
        
        // The value was not an array, recover the items
        if(!Array.isArray(this.value)) {
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
     * Renders this editor
     */
    template() {
        return _.div({class: 'editor__field__value segmented'},
            _.each(this.value, (i, item) => {
                // Render field
                let $field = _.div({class: 'editor__field'});

                let renderField = () => {
                    let schema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(item.schemaId);

                    // Schema could not be found, assign first allowed Schema
                    if(!schema || this.config.allowedSchemas.indexOf(item.schemaId) < 0) {
                        item.schemaId = this.config.allowedSchemas[0];
                    
                        schema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(item.schemaId);
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
                    item.value = ContentHelper.fieldSanityCheck(item.value, schema);

                    // Init the field editor
                    let editorInstance = new editorClass({
                        value: item.value,
                        config: schema.config,
                        schema: schema
                    });

                    // Hook up the change event
                    editorInstance.on('change', (newValue) => {
                        item.value = newValue;
                    });
                    
                    editorInstance.on('silentchange', (newValue) => {
                        item.value = newValue;
                    });

                    // Render Schema picker
                    if(this.config.allowedSchemas.length > 1) {
                        editorInstance.$element.prepend(
                            _.div({class: 'editor__field'},
                                _.div({class: 'editor__field__key'}, 'Schema'),
                                _.div({class: 'editor__field__value'},
                                    new HashBrown.Views.Widgets.Dropdown({
                                        value: item.schemaId,
                                        placeholder: 'Schema',
                                        valueKey: 'id',
                                        labelKey: 'name',
                                        iconKey: 'icon',
                                        options: resources.schemas.filter((schema) => {
                                            return this.config.allowedSchemas.indexOf(schema.id) > -1;
                                        }),
                                        onChange: (newSchemaId) => {
                                            item.schemaId = newSchemaId;

                                            renderField();

                                            this.trigger('change', this.value);
                                        }
                                    }).$element
                                )
                            )
                        );
                    }
                
                    _.append($field.empty(),
                        _.div({class: 'editor__field__sort-key'}, schema.name),
                        editorInstance.$element,
                        _.div({class: 'editor__field__actions'},
                            _.button({class: 'editor__field__action editor__field__action--collapse', title: 'Collapse/expand item'})
                                .click(() => {
                                    $field.toggleClass('collapsed');
                                }),
                            _.button({class: 'editor__field__action editor__field__action--remove', title: 'Remove item'})
                                .click(() => {
                                    this.value.splice(i, 1);
                            
                                    this.trigger('change', this.value);

                                    this.fetch();
                                })
                        )
                    );
                };

                renderField();

                return $field;
            }),
            _.button({title: 'Add an item', class: 'editor__field__add widget widget--button round fa fa-plus'})
                .click(() => {
                    let index = this.value.length;

                    if(this.config.maxItems && index >= this.config.maxItems) {
                        UI.messageModal('Item maximum reached', 'You  can maximum add ' + this.config.maxItems + ' items here');
                        return;
                    }

                    this.value[index] = { value: null, schemaId: null };

                    this.trigger('change', this.value);

                    // Restore the scroll position with 100ms delay
                    HashBrown.Views.Editors.ContentEditor.restoreScrollPos(100);
                    
                    this.fetch();
                })
        );
    }    
}

module.exports = ArrayEditor;
