'use strict';

/**
 * An array editor for editing a list of other field values
 */
class ArrayEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'array-editor field-editor'});

        this.$keyContent = _.button({class: 'btn btn-primary btn-array-editor-sort-items'},
            _.span({class: 'text-default'}, 'Sort'),
            _.span({class: 'text-sorting', style: 'display: none'}, 'Done')
        ).click(() => {
            this.onClickSort();
        });
        
        this.fetch();
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
                        
                        // Change the index in the schema bindings array
                        let schema = this.value.schemaBindings[oldIndex];
                        this.value.schemaBindings.splice(oldIndex, 1);
                        this.value.schemaBindings.splice(newIndex, 0, schema)
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
        // Sanity check for item schema
        if(!this.config.allowedSchemas) {
            this.config.allowedSchemas = []
        }
        
        let itemSchemaId = this.value.schemaBindings[index];

        // Schema could not be found, assign first allowed schema
        if(
            this.config.allowedSchemas.length > 0 &&
            (
                !itemSchemaId ||
                this.config.allowedSchemas.indexOf(itemSchemaId) < 0
            )
        ) {
            itemSchemaId = this.config.allowedSchemas[0];                    
            this.value.schemaBindings[index] = itemSchemaId;
        }

        // Make sure we have the item schema and the editor we need for each array item
        let itemSchema = resources.schemas[itemSchemaId];

        if(itemSchema) {
            let fieldEditor = resources.editors[itemSchema.editorId];

            // Perform sanity check and reassign the item into the array
            item = ContentHelper.fieldSanityCheck(item, itemSchema);
            this.value.items[index] = item;

            // Returns the correct index, even if it's updated
            let getIndex = () => {
                return $element.attr('data-index');
            };

            // Init the schema selector
            let $schemaSelector = _.div({class: 'item-schema-selector kvp'},
                _.div({class: 'key'},
                    'Schema'
                ),
                _.div({class: 'value'},
                    _.select({class: 'form-control'},
                        _.each(this.config.allowedSchemas, (allowedSchemaIndex, allowedSchemaId) => {
                            let allowedSchema = resources.schemas[allowedSchemaId];

                            return _.option({ value: allowedSchemaId },
                                allowedSchema.name
                            );
                        })
                    ).on('change', () => {
                        itemSchemaId = $schemaSelector.find('select').val();

                        this.value.schemaBindings[getIndex()] = itemSchemaId;

                        this.render();
                    }).val(itemSchemaId)
                )
            );

            // Set schema label (used when sorting items)
            let $schemaLabel = _.span({class: 'schema-label'}, itemSchema.name);

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

            // Return the DOM element
            let $element = _.div({class: 'item raised'},
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

            return $element;
        
        } else {
            debug.warning('Schema by id "' + itemSchemaId + '" not found', this);

        }
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
        
        if(!this.value.items) {
            this.value.items = [];
        }

        if(!this.value.schemaBindings) {
            this.value.schemaBindings = [];
        }

        // Render editor
        _.append(this.$element.empty(),
            _.div({class: 'items'},
                // Loop through each array item
                _.each(this.value.items, (i, item) => {
                    return this.renderItem(i, item);
                })    
            ),

            // Render the add item button
            _.button({class: 'btn btn-primary btn-raised btn-add-item btn-round'},
                '+'
            ).click(() => { this.onClickAddItem(); })
        );

        // Update indices
        this.updateDOMIndices();
    }    
}

module.exports = ArrayEditor;
