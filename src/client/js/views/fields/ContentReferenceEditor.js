'use strict';

const FieldEditor = require('./FieldEditor');

/**
 * An editor for referring to other Content
 */
class ContentReferenceEditor extends FieldEditor {
    constructor(params) {
        super(params);

        this.init();
    }

    /**
     * Event: Change value
     */
    onChange(newValue) {
        this.value = newValue;

        this.trigger('change', this.value);
    }

    /**
     * Gets a list of allowed Content options
     *
     * @returns {Array} List of options
     */
    getDropdownOptions() {
        let allowedContent = [];
        let areRulesDefined = this.config && Array.isArray(this.config.allowedSchemas) && this.config.allowedSchemas.length > 0;

        for(let content of resources.content) {
            content = new Content(content);

            if(areRulesDefined) {
                let isContentAllowed = this.config.allowedSchemas.indexOf(content.schemaId) > -1;
                
                if(!isContentAllowed) { continue; }
            }

            allowedContent[allowedContent.length] = {
                label: content.prop('title', window.language),
                value: content.id,
                selected: content.id == this.value
            };
        }

        return allowedContent;
    }

    render() {
        // Render main element
        this.$element = _.div({class: 'field-editor content-reference-editor'}, [
            // Render preview
            this.renderPreview(),

            // Render picker
            this.$dropdown = UI.inputDropdownTypeAhead('(none)', this.getDropdownOptions(), (newValue) => {
                this.onChange(newValue);             
            }, true)
        ]);
    }
}

module.exports = ContentReferenceEditor;
