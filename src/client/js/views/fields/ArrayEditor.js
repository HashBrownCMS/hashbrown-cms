'use strict';

/**
 * An array editor for editing a list of other field values
 */
class ArrayEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'array-editor field-editor'});

        this.$keyContent = _.div(
            _.button({class: 'btn btn-primary btn-array-editor-sort-items'},
                _.span({class: 'text-default'}, 'Sort'),
                _.span({class: 'text-sorting', style: 'display: none'}, 'Done')
            ).click(() => {
                this.onClickSort();
            }),
            _.button({class: 'btn btn-primary btn-array-editor-sort-items'},
                'Collapse'
            ).click(() => {
                this.onClickCollapseAll();
            }),
            _.button({class: 'btn btn-primary btn-array-editor-sort-items'},
                'Expand'
            ).click(() => {
                this.onClickExpandAll();
            })
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
     * @param {Number} index
     */
    onClickRemoveItem(i) {
        this.value.schemaBindings.splice(i,1);
        this.value.items.splice(i,1);
       
        this.updateDOMIndices();
    }

    /**
     * Event: Click add item
     */
    onClickAddItem() {
        let index = this.value.items.length;

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
    onChange(newValue, i, itemSchema) {
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

        this.trigger('change', this.value);
    }

    /**
     * Event: Click sort
     */
    onClickSort() {
        this.$element.toggleClass('sorting');
        
        let isSorting = this.$element.hasClass('sorting');

        this.$keyContent.find('.text-default').toggle(!isSorting);
        this.$keyContent.find('.text-sorting').toggle(isSorting);

        if(isSorting) {
            this.$element.children('.items').children('.item').each((oldIndex, item) => {
                $(item).exodragdrop({
                    lockX: true,
                    dropContainers: this.$element[0].querySelectorAll('.items'),
                    scrollContainer: document.querySelector('.content-editor .nav-tabs'),
                    onEndDrag: (instance) => {
                        this.updateDOMIndices();
                        
                        let newIndex = parseInt(instance.element.dataset.index);

                        // Change the index in the items array
                        let item = this.value.items[oldIndex];
                        this.value.items.splice(oldIndex, 1);
                        this.value.items.splice(newIndex, 0, item)
                        
                        // Rebuild Schema bindings array
                        this.rebuildSchemaBindings();
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
            return $element.attr('data-index');
        };

        // Renders this item
        let rerenderItem = () => {
            // Account for large arrays
            if(this.value.items.length >= 6) {
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
            let schemaLabel =
                (item ? (item.name || item.title || item.description || item.type || item.id) : null) ||
                (itemSchema ? (itemSchema.name) : null) ||
                'Item #' + getIndex();
            let $schemaLabel = _.span({class: 'schema-label'}, schemaLabel);

            // Expanding/collapsing an item
            let $btnToggle = _.button({class: 'btn btn-embedded btn-toggle'},
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

            // Hook up the change event
            fieldEditorInstance.on('change', (newValue) => {
                this.onChange(newValue, getIndex(), itemSchema);
            });

            // Render the DOM element
            _.append($element.empty(),
                $btnToggle,
                _.button({class: 'btn btn-embedded btn-remove'},
                    _.span({class: 'fa fa-remove'})
                ).click(() => {
                    this.onClickRemoveItem(getIndex());
                    $element.remove();
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
        
        // NOTE: The reason for having a separate array with schema ids is that there is no way
        // to associate a value with a schema id if it's not an Object type, like a String

        // A sanity check to make sure we're working with an object
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
            _.button({class: 'btn btn-primary btn-raised btn-add-item btn-round'},
                '+'
            ).click(() => { this.onClickAddItem(); })
        );

        // Render items asynchronously to accommodate for large arrays
        let renderNextItem = (i) => {
            // Update DOM indices after all items have been rendered
            if(i >= this.value.items.length) {
                this.updateDOMIndices();
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
