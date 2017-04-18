'use strict';

const FieldEditor = require('./FieldEditor');

/**
 * An array editor for editing a list of other field values
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

        this.value.schemaBindings.splice(i,1);
        this.value.items.splice(i,1);

        $element.remove();

        this.updateDOMIndices();
    }

    /**
     * Event: Click add item
     */
    onClickAddItem() {
        let index = this.value.items.length;

        if(this.config.maxItems && index >= this.config.maxItems) {
            UI.messageModal('Item maximum reached', 'You  can maximum add ' + this.config.maxItems + ' items here');
            return;
        }

        this.value.items[index] = null;
        this.value.schemaBindings[index] = null;

        this.$element.children('.items').append(this.renderItem(index, null));
        
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
            if(!this.value.items[i] || typeof this.value.items[i] !== 'object') {
                this.value.items[i] = {};
            }
            
            this.value.items[i]._multilingual = true;
            this.value.items[i][window.language] = newValue;

        } else {
            this.value.items[i] = newValue;
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
                $(item).exodragdrop({
                    lockX: true,
                    dropContainers: this.$element[0].querySelectorAll('.items'),
                    scrollContainer: document.querySelector('.content-editor .tab-content'),
                    onEndDrag: (instance) => {
                        this.updateDOMIndices();
                        
                        let newIndex = parseInt(instance.element.dataset.index);

                        // Change the index in the items array
                        let item = this.value.items[oldIndex];
                        this.value.items.splice(oldIndex, 1);
                        this.value.items.splice(newIndex, 0, item)
                        
                        // Rebuild Schema bindings array
                        this.rebuildSchemaBindings();

                        this.trigger('change', this.value);
                    }
                });
            });
        
        } else {
            this.updateDOMIndices();
            
            this.$element.children('.items').children('.item').each(function() {
                $(this).exodragdrop('destroy');
            });
        }
    }

    /**
     * Rebuild Schema bindings
     */
    rebuildSchemaBindings() {
        this.value.schemaBindings = [];

        this.$element.find('.item').each((i, element) => {
            this.value.schemaBindings[element.dataset.index] = element.dataset.schema;
        });
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
     * @param {Object} item
     *
     * @returns {HTMLElement} Item
     */
    renderItem(index, item) {
        let $element = _.div({class: 'item raised', 'data-index': index});
            
        // Returns the correct index, even if it's updated
        let getIndex = () => {
            return parseInt($element.attr('data-index'));
        };

        // Renders this item
        let rerenderItem = () => {
            // Account for large arrays
            if(this.value.items.length >= 20) {
                $element.addClass('collapsed');
            }

            let itemSchemaId = this.value.schemaBindings[getIndex()];

            // Schema could not be found, assign first allowed schema
            if(
                this.config.allowedSchemas.length > 0 &&
                (
                    !itemSchemaId ||
                    this.config.allowedSchemas.indexOf(itemSchemaId) < 0
                )
            ) {
                itemSchemaId = this.config.allowedSchemas[0];                    
                this.value.schemaBindings[getIndex()] = itemSchemaId;
            }

            // Assign the Schema id as a DOM attribute
            $element.attr('data-schema', itemSchemaId);

            // Make sure we have the item schema and the editor we need for each array item
            let itemSchema = SchemaHelper.getFieldSchemaWithParentConfigs(itemSchemaId);

            if(!itemSchema) {
                UI.errorModal(new Error('Schema by id "' + itemSchemaId + '" not found'));
                return;
            }

            let fieldEditor = resources.editors[itemSchema.editorId];

            if(!fieldEditor) {
                UI.errorModal(new Error('Field editor "' + fieldEditor + '" was not found'));
            }

            // Perform sanity check and reassign the item into the array
            item = ContentHelper.fieldSanityCheck(item, itemSchema);
            this.value.items[getIndex()] = item;

            // Create dropdown array for Schema selector
            let dropdownOptions = [];

            for(let allowedSchemaId of this.config.allowedSchemas) {
                let allowedSchema = resources.schemas[allowedSchemaId];

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
                        this.value.schemaBindings[getIndex()] = newValue;
                   
                        // Re-render this item
                        rerenderItem();
                    })
                )
            );

            // Set schema label (used when sorting items)
            let schemaLabel = '';

            // Get the label from the item
            // TODO (Issue #157): Make this recursive, so we can find detailed values in structs 
            if(item) {
                // This item is a string
                if(typeof item === 'string') {
                    // This item is an id
                    if(item.length === 40) {
                        let content = ContentHelper.getContentByIdSync(item);

                        if(content) {
                            schemaLabel = content.prop('title', window.language) || content.id || schemaLabel;
                        
                        } else {
                            let media = MediaHelper.getMediaByIdSync(item);

                            if(media) {
                                schemaLabel = media.name || media.url || schemaLabel;
                            }
                        }

                    // This item is another type of string
                    } else {
                        schemaLabel = item || schemaLabel;
                    }

                // This item is a struct
                } else if(item instanceof Object) {
                    // Try to get a field based on the usual suspects
                    schemaLabel = item.name || item.title || item.text || item.heading || item.header || item.body || item.description || item.type || item.body || item.id || schemaLabel;
                  
                    if(!schemaLabel) { 
                        // Find the first available field
                        for(let configKey in itemSchema.config || {}) {
                            let configValue = itemSchema.config[configKey];

                            // If a label field was found, check if it has a value
                            if(item[configKey]) {
                                schemaLabel = item[configKey] || schemaLabel;
                                console.log('s2', schemaLabel);
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
                value: itemSchema.multilingual ? item[window.language] : item,
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

    render() {
        // Recover flat arrays
        if(Array.isArray(this.value)) {
            this.value = {
                items: this.value,
                schemaBindings: []
            };
        }
        
        // NOTE: The reason for having a separate array with Schema ids is that there is no other way
        // to associate a value with a Schema id if it's not an Object type, like a String or a Number

        // A sanity check to make sure we're working with an object value
        if(
            !this.value ||
            !(this.value instanceof Object)
        ) {
            this.value = {
                items: [],
                schemaBindings: []
            };
        
        }

        // Sanity check for items array
        if(!this.value.items) {
            this.value.items = [];
        }

        // Sanity check for Schema bindings array
        if(!this.value.schemaBindings) {
            this.value.schemaBindings = [];
        }
        
        // Sanity check for allowed Schemas array
        if(!this.config.allowedSchemas) {
            this.config.allowedSchemas = []
        }

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
            if(i >= this.value.items.length) {
                this.updateDOMIndices();
                
                ContentEditor.restoreScrollPos();
                
                return;
            }

            // Append the item to the DOM
            this.$element.children('.items').append(
                this.renderItem(i, this.value.items[i])
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
