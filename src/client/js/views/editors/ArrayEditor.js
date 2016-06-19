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
        this.value.splice(i,1);

        this.render();
    }

    /**
     * Event: Click add item
     */
    onClickAddItem() {
        this.value.push(null);

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
            if(!this.value[i] || typeof this.value[i] !== 'object') {
                this.value[i] = {};
            }
            
            this.value[i]._multilingual = true;
            this.value[i][window.language] = newValue;

        } else {
            this.value[i] = newValue;
        }

        this.trigger('change', this.value);
    }

    render() {
        // A sanity check to make sure we're working with an array
        if(!Array.isArray(this.value)) {
            this.value = [];
        }

        // Render editor
        _.append(this.$element.empty(),
            _.div({class: 'items'},
                // Loop through each array item
                _.each(this.value, (i, item) => {
                    // Sanity check for item schema
                    if(
                        this.config.allowedSchemas &&
                        this.config.allowedSchemas.length > 0 &&
                        this.config.allowedSchemas.indexOf(item.schemaId) < 0
                    ) {
                        item.schemaId = this.config.allowedSchemas[0];                    
                    }

                    // Make sure we have the item schema and the editor we need for each array item
                    let itemSchema = resources.schemas[item.schemaId];
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
                                item.schemaId = $schemaSelector.find('select').val();

                                this.trigger('change', this.value);

                                this.render();
                            }).val(item.schemaId)
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
                    return _.div({class: 'item'},
                        _.button({class: 'btn btn-embedded btn-remove'},
                            _.span({class: 'fa fa-remove'})
                        ).click(() => { this.onClickRemoveItem(i); }),
                        $schemaSelector,
                        fieldEditorInstance.$element
                    );
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
