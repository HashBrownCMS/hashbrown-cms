'use strict';

const FieldEditor = require('./FieldEditor');

/**
 * An editor for referencing templates
 *
 * @description Example:
 * <pre>
 * {
 *     "myTemplateReference": {
 *         "label": "My template reference",
 *         "tabId": "content",
 *         "schemaId": "templateReference",
 *         {
 *             "type": "page" || "partial",
 *             "allowedTemplates": [ "myPageTemplate", "myOtherPageTemplate" ]
 *         }
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */
class TemplateReferenceEditor extends FieldEditor {
    constructor(params) {
        super(params);

        this.init();
    }
   
    /**
     * Event: Change value
     *
     * @param {String} newValue
     */ 
    onChange(newValue) {
        this.value = newValue;

        this.trigger('change', this.value);
    }
   
    /**
     * Renders the config editor
     *
     * @param {Object} config
     *
     * @returns {HTMLElement} Element
     */
    static renderConfigEditor(config) {
        config.type = config.type || 'page';
        config.allowedTemplates = config.allowedTemplates || [];

        let $element = _.div();

        let render = () => {
            _.append($element.empty(), 
                _.div({class: 'editor__field'},
                    _.div({class: 'editor__field__key'}, 'Type'),
                    _.div({class: 'editor__field__value'},
                        new HashBrown.Views.Widgets.Dropdown({
                            options: [ 'page', 'partial' ],
                            value: config.type,
                            onChange: (newType) => {
                                config.type = newType;

                                render();
                            }
                        }).$element
                    )
                ),
                _.div({class: 'editor__field'},
                    _.div({class: 'editor__field__key'}, 'Allowed Templates'),
                    _.div({class: 'editor__field__value'},
                        new HashBrown.Views.Widgets.Dropdown({
                            options: HashBrown.Helpers.TemplateHelper.getAllTemplates(config.type),
                            value: config.allowedTemplates,
                            labelKey: 'name',
                            valueKey: 'id',
                            useMultiple: true,
                            useClearButton: true,
                            useTypeAhead: true,
                            onChange: (newValue) => {
                                config.allowedTemplates = newValue;
                            }
                        })
                    )
                )
            );
        };

        render();

        return $element;
    }

    /**
     * Renders this editor
     */
    render() {
        this.$element = _.div({class: 'field-editor template-reference-editor'});

        let resource = window.resources.templates;
        let dropdownOptions = [];

        // Sanity check for template type
        this.config.type = this.config.type || 'page';
        
        // Backwards compatibility check for template type
        if(this.config.resource == 'partialTemplates' || this.config.resource == 'sectionTemplates') {
            this.config.type = 'partial';
        }

        // Sanity check for allowed templates
        if(!this.config.allowedTemplates) {
            this.config.allowedTemplates = [];
        }

        // If no templates are available, display a warning
        if(resource.length < 1) {
            this.$element.html(_.span({class: 'field-warning'}, 'No templates configured'));
            return;
        }
        
        // If no allowed templates are configured, display a warning
        if(this.config.allowedTemplates.length < 1) {
            this.$element.html(_.span({class: 'field-warning'}, 'No allowed templates configured'));
            return;
        }

        // If no allowed template is set, apply the first of the allowed templates
        if(!this.value || this.config.allowedTemplates.indexOf(this.value) < 0) {
            this.value = this.config.allowedTemplates[0];
            
            // Set values in dropdown element    
            this.$element.find('.dropdown-menu-toggle').html(this.value);
            this.$element.find('.dropdown-menu li[data-value="' + this.value + '"]').addClass('active');
            
            // Apply changes on next CPU cycle
            setTimeout(() => {
                this.trigger('change', this.value);
            }, 1);
        }

        // Generate dropdown options
        for(let template of resource) {
            let isAllowed =
                this.config.type == template.type &&
                this.config.allowedTemplates.indexOf(template.id) > -1;

            if(!isAllowed) { continue; }

            dropdownOptions[dropdownOptions.length] = {
                label: template.name,
                value: template.id,
                selected: template.id == this.value
            };
        }

        // Render picker
        _.append(this.$element,
            // Render preview
            this.renderPreview(),

            UI.inputDropdownTypeAhead('(none)', dropdownOptions, (newValue) => {
                this.onChange(newValue);
            }, false)
        );
    }
}

module.exports = TemplateReferenceEditor;
