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
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.fetch();
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
     * Sanity check
     */
    sanityCheck() {
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

        // If no allowed template is set, apply the first of the allowed templates
        if(!this.value || this.config.allowedTemplates.indexOf(this.value) < 0) {
            // This will be null if no allwoed templates are set
            this.value = this.config.allowedTemplates[0];
            
            // Apply changes on next CPU cycle
            setTimeout(() => {
                this.trigger('silentchange', this.value);
            }, 500);
        }
    }

    /**
     * Generates dropdown options
     *
     * @returns {Array} Options
     */
    getOptions() {
        let dropdownOptions = [];

        for(let template of resources.templates) {
            let isAllowed =
                this.config.type == template.type &&
                this.config.allowedTemplates.indexOf(template.id) > -1;

            if(!isAllowed) { continue; }

            dropdownOptions[dropdownOptions.length] = template;
        }

        return dropdownOptions;
    }

    /**
     * Pre render
     */
    prerender() {
        this.sanityCheck();
    }

    /**
     * Renders this editor
     */
    template() {
        // If no templates are available, display a warning
        if(resources.templates.length < 1) {
            return _.div({class: 'editor__field__value'},
                _.span({class: 'editor__field__value__warning', title: 'You need to set up your Connection to provide Templates before they can be used'}, 'No templates available')
            );
        }
        
        // If no allowed templates are configured, display a warning
        if(this.config.allowedTemplates.length < 1) {
            return _.div({class: 'editor__field__value'}, 
                _.span({class: 'editor__field__value__warning', title: 'You need to add some allowed Templates to this Content Schema'}, 'No allowed templates configured')
            );
        }

        return _.div({class: 'editor__field__value'},
            new HashBrown.Views.Widgets.Dropdown({
                useTypeAhead: true,
                value: this.value,
                tooltip: this.description || '',
                options: this.getOptions(),
                labelKey: 'name',
                valueKey: 'id',
                onChange: (newValue) => {
                    this.value = newValue;

                    this.trigger('change', this.value);
                }
            }).$element
        );
    }
}

module.exports = TemplateReferenceEditor;
