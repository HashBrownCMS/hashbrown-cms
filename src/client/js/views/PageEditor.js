'use strict';

// Lib
let jade = require('jade');

// Models
let Page = require('../../../server/models/Page');

// Views
let MessageModal = require('./MessageModal');

class PageEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'page-editor'});

        this.fetch();
    }

    /**
     * Event: Click reload. Fetches the model again
     */
    onClickReload() {
        this.fetch();
    }

    /**
     * Event: Click save. Posts the model to the modelUrl
     */
    onClickSave() {
        let view = this;

        $.post(
            this.modelUrl,
            this.model,
            function() {
                console.log('[PageEditor] Saved model to ' + view.modelUrl);
            },
            function(err) {
                new MessageModal({
                    model: {
                        title: 'Error',
                        body: err
                    }
                });
            }
        );
    }

    /**
     * Event: Click toggle publish
     */
    onClickTogglePublish() {

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
                let fieldElement = jade.compile(fieldView)({ value: fieldValue, disabled: schemaValue.disabled, resources });
                let $fieldElement = $(fieldElement);

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
        let view = this;

        let page = new Page(this.model);
        let objectSchemas = resources['objectSchemas'];
        let pageSchema = {};

        for(let i in objectSchemas) {
            if(objectSchemas[i].id == this.model.schemaId) {
                pageSchema = objectSchemas[i];
                break;
            }
        }

        this.$element.html([
            this.renderObject(this.model, pageSchema),
            _.div({class: 'pull-left btn-group flex-horizontal'}, [
                _.button({class: 'btn btn-primary flex-expand'},
                    _.span({class: 'fa fa-refresh'})
                ).click(function() { view.onClickReload(); }),
                _.button({class: 'btn btn-primary flex-expand'}, [
                    (page.isPublished() ? 'Unpublish' : 'Publish') + ' ',
                    _.span({class: 'fa fa-newspaper-o'})
                ]).click(function() { view.onClickTogglePublish(); }),
                _.button({class: 'btn btn-success flex-expand'}, [
                    'Save ',
                    _.span({class: 'fa fa-save'})
                ]).click(function() { view.onClickSave(); })
            ])
        ]);
    }
}

module.exports = PageEditor;
