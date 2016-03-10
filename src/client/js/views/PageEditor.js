'use strict';

// Lib
let marked = require('marked');
let toMarkdown = require('to-markdown');

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
     * Event: On click remove
     */
    onClickDelete() {
        new MessageModal({
            model: {
                title: 'Delete page',
                body: 'Are you sure you want to delete this page?'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                    callback: function() {
                    }
                },
                {
                    label: 'OK',
                    class: 'btn-danger',
                    callback: function() {
                    }
                }
            ]
        });
    }

    /**
     * Binds a change event to a field view
     *
     * @param {Object} $fieldElement
     * @param {Object} fieldValue
     * @param {Function} handler
     */
    bindChangeEvent($fieldElement, fieldValue, handler) {
        function onChange($element) {
            if($(this).length > 0) {
                $element = $(this);
            }

            let valueName = $element.data('name');

            if(valueName) {
                fieldValue[valueName] = $element.val();
            
            } else {
                fieldValue = $element.val();

            }

            handler(fieldValue);
        }

        // Input
        $fieldElement.find('input').each(function(i) {
            $(this).bind('change propertychange keyup paste', onChange);
        });
        
        // RTE
        if($fieldElement.hasClass('rich-text-editor')) {
            let $textarea = $fieldElement.find('textarea');
            let $output = $fieldElement.find('.rte-output');
            
            $output.attr('contenteditable', true);

            $output.bind('change propertychange keyup paste', function() {
                $textarea.val(toMarkdown($output.html()));
            
                onChange($textarea);
            });

            $textarea.bind('change propertychange keyup paste', function() {
                $output.html(marked($textarea.val()));
            
                onChange($textarea);
            });
            
            $output.html(marked($textarea.val()));
        }

        // Date picker
        if($fieldElement.hasClass('date-editor')) {
            let $input = $fieldElement.find('input');

            $input.datepicker();
        }
    }

    /**
     * Renders a field view
     *
     * @param {Object} field
     * @param {Object} schema
     * @param {Function} inputHandler
     *
     * @return {Object} element
     */
    renderFieldView(fieldValue, schemaValue, inputHandler) {
        let fieldSchema = resources.schemas[schemaValue.$ref];

        if(fieldSchema) {
            let fieldView = resources.fieldViews[fieldSchema.id];
            
            if(fieldView) {
                let fieldElement = fieldView({ value: fieldValue, disabled: schemaValue.disabled, resources });
                let $fieldElement = $(fieldElement);

                this.bindChangeEvent($fieldElement, fieldValue, inputHandler);

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
            _.ul({class: 'nav nav-tabs'}, 
                _.each(schema.tabs, function(id, tab) {
                    return _.li({class: id == schema.defaultTabId ? 'active' : ''}, 
                        _.a({'data-toggle': 'tab', href: '#tab-' + id},
                            tab
                        )
                    );
                })
            ),
            _.div({class: 'tab-content'},
                _.each(schema.tabs, function(id, tab) {
                    let properties = {};
                    
                    for(let alias in schema.properties) {
                        let property = schema.properties[alias];

                        let noTabAssigned = !property.tabId;
                        let isMetaTab = tab == 'Meta';
                        let thisTabAssigned = property.tabId == id;

                        if((noTabAssigned && isMetaTab) || thisTabAssigned) {
                            properties[alias] = property;
                        }
                    }

                    return _.div({id: 'tab-' + id, class: 'tab-pane' + (id == schema.defaultTabId ? ' active' : '')}, 
                        _.each(properties, function(key, value) {
                            return _.div({class: 'field-container'}, [
                                _.div({class: 'field-icon'},
                                    _.span({class: 'fa fa-' + value.icon})
                                ),
                                _.div({class: 'field-key'},
                                    value.label || key
                                ),
                                _.div({class: 'field-value'},
                                    view.renderFieldView(
                                        object[key],
                                        schema.properties[key],
                                        function(newValue) {
                                            object[key] = newValue;
                                        }
                                    )
                                )
                            ]);
                        })
                    );
                })
            )
        ]);
    }

    /**
     * Gets a schema with $parent included recursively
     *
     * @param {Number} id
     *
     * @return {Object} schema
     */
    getSchemaWithParents(id) {
        let schema = $.extend(true, {}, resources.schemas[id]);

        if(schema) {
            // Merge parent with current schema
            // Since the child schema should override any duplicate content, the parent is transformed first, then returned as the resulting schema
            if(schema.$parent) {
                let parentSchema = this.getSchemaWithParents(schema.$parent);

                for(let k in schema.properties) {
                   parentSchema.properties[k] = schema.properties[k];
                }
                
                for(let k in schema.tabs) {
                   parentSchema.tabs[k] = schema.tabs[k];
                }

                parentSchema.defaultTabId = schema.defaultTabId;

                schema = parentSchema;
            }

        } else {
            console.log('No schema with id "' + id + '" available in resources');
        
        }

        return schema;
    }


    render() {
        let view = this;

        let page = new Page(this.model);
        let pageSchema = this.getSchemaWithParents(this.model.schemaId);

        if(pageSchema) {
            this.$element.html([
                this.renderObject(this.model, pageSchema).append(
                    _.div({class: 'panel panel-default panel-buttons'}, 
                        _.div({class: 'btn-group'}, [
                            _.button({class: 'btn btn-danger'},
                                _.span({class: 'fa fa-trash'})
                            ).click(function() { view.onClickDelete(); }),
                            _.button({class: 'btn btn-primary'},
                                _.span({class: 'fa fa-refresh'})
                            ).click(function() { view.onClickReload(); }),
                            _.button({class: 'btn btn-default'}, [
                                (page.isPublished() ? 'Unpublish' : 'Publish') + ' ',
                                _.span({class: 'fa fa-newspaper-o'})
                            ]).click(function() { view.onClickTogglePublish(); }),
                            _.button({class: 'btn btn-success'}, [
                                'Save ',
                                _.span({class: 'fa fa-save'})
                            ]).click(function() { view.onClickSave(); })
                        ])
                    )
                )
            ]);
        }
    }
}

module.exports = PageEditor;
