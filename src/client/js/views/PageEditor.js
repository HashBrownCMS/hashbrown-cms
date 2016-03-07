'use strict';

class PageEditor extends View {
    constructor(params) {
        super(params);
    }

    /**
     * Renders a field
     *
     * @param {Object} field
     * @param {Object} schema
     *
     * @return {Object} element
     */
    renderField(field, schema) {

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

    }

    render() {
        let objectSchemas = window.resources['objectSchemas'];
        let pageSchema = {};

        for(let i in objectSchemas) {
            if(objectSchemas[i].id == this.model.schemaId) {
                pageSchema = objectSchemas[i];
                break;
            }
        }

        this.$element = _.div({class: 'page-editor'},
            this.renderObject(this.model, pageSchema)
        );
    }
}

module.exports = PageEditor;
