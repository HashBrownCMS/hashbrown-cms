'use strict';

let jade = require('jade');

class PageEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'page-editor'});

        this.fetch();
    }

    /**
     * Renders a field view
     *
     * @param {Object} field
     * @param {Object} schema
     *
     * @return {Object} element
     */
    renderFieldView(fieldValue, schemaValue) {
        function onChange() {
            let valueName = $(this).data('name');

            if(valueName) {
                fieldValue[valueName] = $(this).val();
            
            } else {
                fieldValue = $(this).val();

            }

            console.log(fieldValue);
        }

        let fieldSchema = resources['fieldSchemas'][schemaValue.$ref];

        if(fieldSchema) {
            let fieldView = resources['fieldViews'][fieldSchema.id];
            
            if(fieldView) {
                let fieldElement = jade.compile(fieldView)({ value: fieldValue });
                let $fieldElement = $(fieldElement);

                $fieldElement.attr('data-field-schema-id', fieldSchema.id);

                // Input
                $fieldElement.find('input').each(function(i) {
                    $(this).bind('change propertychange keyup paste', onChange);
                });

                return $fieldElement;

            } else {
                console.log('[PageEditor] No template found for field schema id "' + fieldSchema.id + '"');
            
            }
        
        } else {
            console.log('[PageEditor] No field schema found for $ref "' + schemaValue.$ref + '"');

        }
    }

    /**
     * Renders an object
     *
     * @param {Object} data
     * @param {Object} schema
     *
     * @return {Object} element
     */
    renderObject(object, schema) {
        let view = this;

        return _.div({class: 'object'}, [
            _.each(schema.properties, function(key, value) {
                return _.div({class: 'field-container'}, [
                    _.div({class: 'field-key'},
                        value.label || key
                    ),
                    _.div({class: 'field-value'},
                        view.renderFieldView(object[key], schema.properties[key])
                    )
                ]);
            })
        ]);
    }

    render() {
        let objectSchemas = resources['objectSchemas'];
        let pageSchema = {};

        for(let i in objectSchemas) {
            if(objectSchemas[i].id == this.model.schemaId) {
                pageSchema = objectSchemas[i];
                break;
            }
        }

        this.$element.html(
            this.renderObject(this.model, pageSchema)
        );
    }
}

module.exports = PageEditor;
