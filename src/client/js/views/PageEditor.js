'use strict';

class PageEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'page-editor'});

        this.fetch();
    }

    /**
     * Renders a field value
     *
     * @param {Object} field
     * @param {Object} schema
     *
     * @return {Object} element
     */
    renderFieldValue(fieldValue, schema) {

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

        console.log(schema);

        return _.div({class: 'object'}, [
            _.each(schema.properties, function(key, value) {
                return _.div({class: 'field-container'}, [
                    _.div({class: 'field-key'},
                        key
                    ),
                    _.div({class: 'field-value'},
                        view.renderFieldValue(object[key], schema.properties[key])
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
