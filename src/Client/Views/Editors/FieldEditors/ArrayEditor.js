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
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'array-editor field-editor'});

        this.$keyContent = _.div({class: 'array-field-key'},
            _.div({class: 'widget-sorting'},
                _.button({class: 'btn btn-default'},
                    'Done'
                ).click(() => {
                    this.onClickSort();
                })
            ),
            _.div({class: 'widget-default'},
                _.button({class: 'btn btn-default'},
                    'Sort',
                ).click(() => {
                    this.onClickSort();
                }),
                _.button({class: 'default btn btn-default'},
                    'Collapse'
                ).click(() => {
                    this.onClickCollapseAll();
                }),
                _.button({class: 'btn btn-default'},
                    'Expand'
                ).click(() => {
                    this.onClickExpandAll();
                })
            )
        );

        this.fetch();
    }
    
    /**
     * Event: Click expand all items
     */
    onClickExpandAll() {
        this.$element.find('.item').each((e, element) => {
            $(element).toggleClass('collapsed', false);
        });
    }
    
    /**
     * Event: Click collapse all items
     */
    onClickCollapseAll() {
        this.$element.find('.item').each((e, element) => {
            $(element).toggleClass('collapsed', true);
        });
    }

    /**
     * Event: Click remove item
     *
     * @param {HTMLElement} element
     */
    onClickRemoveItem($element) {
        let i = $element.attr('data-index');

        this.value.splice(i,1);

        $element.remove();

        this.updateDOMIndices();
    }

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

        this.$element.children('.items').append(this.renderItem(index));
        
        this.updateDOMIndices();
    }

    /**
     * Event: Change value
     *
     * @param {Object} newValue
     * @param {Number} index
     * @param {Schema} itemSchema
     */
    onChangeValue(newValue, i, itemSchema) {
        if(itemSchema.multilingual) {
            // Sanity check to make sure multilingual fields are accomodated for
            if(!this.value[i] || typeof this.value[i] !== 'object') {
                this.value[i] = { value: null, schemaId: null };
            }
            
            this.value[i].value._multilingual = true;
            this.value[i].value[window.language] = newValue;

        } else {
            this.value[i].value = newValue;
        }
    }

    /**
     * Event: Change
     */
    onChange(newValue, i, itemSchema) {
        this.onChangeValue(newValue, i, itemSchema);

        this.trigger('change', this.value);
    }
    
    /**
     * Event: Silent change
     */
    onSilentChange(newValue, i, itemSchema) {
        this.onChangeValue(newValue, i, itemSchema);

        this.trigger('silentchange', this.value);
    }

    /**
     * Event: Click sort
     */
    onClickSort() {
        this.$element.toggleClass('sorting');
        
        let isSorting = this.$element.hasClass('sorting');

        this.$keyContent.toggleClass('sorting', isSorting);

        if(isSorting) {
            this.$element.children('.items').children('.item').each((oldIndex, item) => {
                $(item).crdragdrop({
                    lockX: true,
                    dropContainers: this.$element[0].querySelectorAll('.items'),
                    scrollContainer: document.querySelector('.content-editor .tab-content'),
                    onEndDrag: (instance) => {
                        this.updateDOMIndices();
                        
                        let newIndex = parseInt(instance.element.dataset.index);

                        // Change the index in the items array
                        let item = this.value[oldIndex];
                        this.value.splice(oldIndex, 1);
                        this.value.splice(newIndex, 0, item)
                        
                        this.trigger('change', this.value);
                    }
                });
            });
        
        } else {
            this.updateDOMIndices();
            
            this.$element.children('.items').children('.item').each(function() {
                $(this).crdragdrop('destroy');
            });
        }
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
     * Updates DOM indices
     */
    updateDOMIndices() {
        this.$element.children('.items').children('.item').each((i, element) => {
            element.dataset.index = i;
        });
    }

    /**
     * Renders an item
     *
     * @param {Number} index
     *
     * @returns {HTMLElement} Item
     */
    renderItem(index) {
        let $element = _.div({class: 'item raised', 'data-index': index});
            
        // Returns the correct index, even if it's updated
        let getIndex = () => {
            return parseInt($element.attr('data-index'));
        };

        // Renders this item
        let rerenderItem = () => {
            // Check if item exists
            let item = this.value[getIndex()];
            
            if(!item) {
                return UI.errorModal(new Error('Index "' + getIndex() + '" is out of bounds'));
            }

            // Account for large arrays
            if(this.value.length >= 20) {
                $element.addClass('collapsed');
            }

            let itemSchemaId = this.value[getIndex()].schemaId;

            // Schema could not be found, assign first allowed Schema
            if(!itemSchemaId || this.config.allowedSchemas.indexOf(itemSchemaId) < 0) {
                itemSchemaId = this.config.allowedSchemas[0];
                this.value[getIndex()].schemaId = itemSchemaId;
            }

            // Assign the Schema id as a DOM attribute
            $element.attr('data-schema', itemSchemaId);

            // Make sure we have the item schema and the editor we need for each array item
            let itemSchema = SchemaHelper.getFieldSchemaWithParentConfigs(itemSchemaId);

            if(!itemSchema) {
                return UI.errorModal(new Error('Schema by id "' + itemSchemaId + '" not found'));
            }

            let fieldEditor = ContentEditor.getFieldEditor(itemSchema.editorId);

            if(!fieldEditor) {
                return UI.errorModal(new Error('Field editor "' + fieldEditor + '" was not found'));
            }

            // Perform sanity check on item value
            item.value = ContentHelper.fieldSanityCheck(item.value, itemSchema);

            // Create dropdown array for Schema selector
            let dropdownOptions = [];

            for(let allowedSchemaId of this.config.allowedSchemas) {
                let allowedSchema = SchemaHelper.getSchemaByIdSync(allowedSchemaId);

                dropdownOptions[dropdownOptions.length] = {
                    value: allowedSchema.id,
                    label: allowedSchema.name,
                    selected: allowedSchema.id == itemSchemaId
                };
            }

            // Render the Schema selector
            let $schemaSelector = _.div({class: 'item-schema-selector kvp'},
                _.div({class: 'key'},
                    'Schema'
                ),
                _.div({class: 'value'},
                    UI.inputDropdownTypeAhead('(none)', dropdownOptions, (newValue) => {
                        // Set new value in Schema bindings
                        item.schemaId = newValue;
                   
                        // Re-render this item
                        rerenderItem();
                    })
                )
            );

            // Set schema label (used when sorting items)
            let schemaLabel = '';

            // Get the label from the item
            // TODO (Issue #157): Make this recursive, so we can find detailed values in structs 
            if(item.value) {
                // This item is a string
                if(typeof item.value === 'string') {
                    // This item is an id
                    if(item.value.length === 40) {
                        let content = ContentHelper.getContentByIdSync(item.value);

                        if(content) {
                            schemaLabel = content.prop('title', window.language) || content.id || schemaLabel;
                        
                        } else {
                            let media = MediaHelper.getMediaByIdSync(item.value);

                            if(media) {
                                schemaLabel = media.name || media.url || schemaLabel;
                            }
                        }

                    // This item is another type of string
                    } else {
                        schemaLabel = item.value || schemaLabel;
                    }

                // This item is a struct
                } else if(item instanceof Object) {
                    // Try to get a field based on the usual suspects
                    schemaLabel = item.value.name || item.value.title || item.value.text || item.value.heading || item.value.header || item.value.body || item.value.description || item.value.type || item.value.body || item.value.id || schemaLabel;
                  
                    if(!schemaLabel) { 
                        // Find the first available field
                        for(let configKey in itemSchema.config || {}) {
                            let configValue = itemSchema.config[configKey];

                            // If a label field was found, check if it has a value
                            if(item.value[configKey]) {
                                schemaLabel = item.value[configKey] || schemaLabel;
                                break;
                            }
                        }
                    }
                }
            }

            // If the schema label is multilingual, pick the appropriate string
            if(schemaLabel && schemaLabel._multilingual) {
                schemaLabel = schemaLabel[window.language];
            }

            // If no schema label was found, or it's not a string, resort to generic naming
            if(!schemaLabel || typeof schemaLabel !== 'string') {
                schemaLabel = 'Item #' + (getIndex() + 1);
                
                // Add the Schema name in case we don't find the label field
                if(itemSchema) {
                    schemaLabel += ' (' + itemSchema.name + ')';
                }
            }

            // Create label element 
            let $schemaLabel = _.span({class: 'schema-label'}, schemaLabel);

            // Expanding/collapsing an item
            let $btnToggle = _.button({title: 'Collapse/expand item', class: 'btn btn-embedded btn-toggle'},
                _.span({class: 'fa fa-window-maximize'}),
                _.span({class: 'fa fa-window-minimize'})
            ).on('click', () => {
                $element.toggleClass('collapsed');
            });

            // Init the field editor
            let fieldEditorInstance = new fieldEditor({
                value: itemSchema.multilingual ? item.value[window.language] : item.value,
                disabled: itemSchema.disabled || false,
                config: itemSchema.config || {},
                schema: itemSchema
            });

            // Hook up the change events
            fieldEditorInstance.on('change', (newValue) => {
                this.onChange(newValue, getIndex(), itemSchema);
            });
            
            fieldEditorInstance.on('silentchange', (newValue) => {
                this.onSilentChange(newValue, getIndex(), itemSchema);
            });

            // Render the DOM element
            _.append($element.empty(),
                $btnToggle,
                _.button({title: 'Remove item', class: 'btn btn-embedded btn-remove'},
                    _.span({class: 'fa fa-remove'})
                ).click(() => {
                    this.onClickRemoveItem($element);
                }),
                $schemaLabel,
                this.config.allowedSchemas.length > 1 ? $schemaSelector : null,
                fieldEditorInstance.$element
            );
        };

        rerenderItem();

        return $element;
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
                this.trigger('change', this.value);
            }, 500);
        }

        // The value was below the required amount
        if(this.value.items.length < this.config.minItems) {
            let diff = this.config.minItems - this.value.items.length;

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
     * Renders this editor
     */
    render() {
        // Perform sanity check
        this.sanityCheck();

        // Render editor
        _.append(this.$element.empty(),
            _.div({class: 'items'}),

            // Render the add item button
            _.button({title: 'Add item', class: 'btn btn-primary btn-raised btn-add-item btn-round'},
                _.span({class: 'fa fa-plus'})
            ).click(() => { this.onClickAddItem(); })
        );

        // Render items asynchronously to accommodate for large arrays
        let renderNextItem = (i) => {
            // Update DOM indices after all items have been rendered
            if(i >= this.value.length) {
                this.updateDOMIndices();
                
                ContentEditor.restoreScrollPos();
                return;
            }

            // Append the item to the DOM
            this.$element.children('.items').append(
                this.renderItem(i)
            );

            // Render next item in the next CPU cycle
            setTimeout(() => {
                renderNextItem(i + 1);
            }, 1);
        };

        renderNextItem(0);
    }    
}

module.exports = ArrayEditor;
