'use strict';

/**
 * An array editor for editing a list of other field values
 */
class ArrayEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'array-editor field-editor'});

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

        this.render();
    }

    /**
     * Event: Click add item
     */
    onClickAddItem() {
        this.value.items.push(null);

        this.render();
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

    render() {
        // A sanity check to make sure we're working with an array
        if(
            !this.value ||
            typeof this.value !== 'object'
        ) {
            this.value = {
                items: [],
                schemaBindings: []
            };
        
        }
        
        if(Array.isArray(this.value)) {
            this.value = {
                items: this.value,
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
            _.button({class: 'btn btn-primary btn-sort-items'},
                _.span({class: 'text-default'}, 'Sort'),
                _.span({class: 'text-sorting'}, 'Done')
            ).click(() => {
                this.$element.toggleClass('sorting');

                this.$element.find('.item').each(function() {
                    $(this).exodragdrop({
                        lockX: true
                    });
                });
            }),
            _.div({class: 'items'},
                // Loop through each array item
                _.each(this.value.items, (i, item) => {
                    // Sanity check for item schema
                    if(!this.config.allowedSchemas) {
                        this.config.allowedSchemas = []
                    }
                    
                    let itemSchemaId = this.value.schemaBindings[i];

                    if(
                        this.config.allowedSchemas.length > 0 &&
                        (
                            !itemSchemaId ||
                            this.config.allowedSchemas.indexOf(itemSchemaId) < 0
                        )
                    ) {
                        itemSchemaId = this.config.allowedSchemas[0];                    
                        this.value.schemaBindings[i] = itemSchemaId;
                    }

                    // Make sure we have the item schema and the editor we need for each array item
                    let itemSchema = resources.schemas[itemSchemaId];

                    if(itemSchema) {
                        let fieldEditor = resources.editors[itemSchema.editorId];

                        // Sanity check to make sure multilingual fields are accomodated for
                        if(itemSchema.multilingual && (!item || typeof item !== 'object')) {
                            item = {};
                        }

                        // Init the schema selector
                        let $schemaSelector = _.div({class: 'item-schema-selector kvp'},
                            _.div({class: 'key'},
                                'Schema'
                            ),
                            _.div({class: 'value'},
                                _.select({class: 'form-control'},
                                    _.each(this.config.allowedSchemas, (i, allowedSchemaId) => {
                                        let allowedSchema = resources.schemas[allowedSchemaId];

                                        return _.option({ value: allowedSchemaId },
                                            allowedSchema.name
                                        );
                                    })
                                ).on('change', () => {
                                    itemSchemaId = $schemaSelector.find('select').val();

                                    this.value.schemaBindings[i] = itemSchemaId;

                                    this.trigger('change', this.value);

                                    this.render();
                                }).val(itemSchemaId)
                            )
                        );

                        // Init the field editor
                        let fieldEditorInstance = new fieldEditor({
                            value: itemSchema.multilingual ? item[window.language] : item,
                            disabled: itemSchema.disabled || false,
                            config: itemSchema.config || {},
                            schema: itemSchema
                        });

                        // Hook up the change event
                        fieldEditorInstance.on('change', (newValue) => {
                            this.onChange(newValue, i, itemSchema);
                        });

                        // Return the DOM element
                        let $element = _.div({class: 'item'},
                            _.button({class: 'btn btn-embedded btn-remove'},
                                _.span({class: 'fa fa-remove'})
                            ).click(() => { this.onClickRemoveItem(i); }),
                            this.config.allowedSchemas.length > 1 ? $schemaSelector : null,
                            fieldEditorInstance.$element
                        );

                        return $element;
                    
                    } else {
                        debug.warning('Schema by id "' + itemSchemaId + '" not found', this);

                    }
                })    
            ),

            // Render the add item button
            _.button({class: 'btn btn-primary btn-add'},
                _.span({class: 'fa fa-plus'})
            ).click(() => { this.onClickAddItem(); })
        );
    }    
}

module.exports = ArrayEditor;
