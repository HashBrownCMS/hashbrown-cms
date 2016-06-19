'use strict';

/**
 * An editor for referencing templates
 */
class TemplateReferenceEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }
   
    /**
     * Event: Change value
     */ 
    onChange() {
        this.value = this.$select.val();

        this.trigger('change', this.value);
    }
    
    render() {
        this.$element = _.div({class: 'field-editor template-reference-editor'},
            _.select({class: 'form-control'},
                _.each(window.resources[this.config.resource || 'templates'], (i, template) => {
                    return _.option({
                        value: template,
                        selected: this.value == template
                    }, template);
                })
            ).change(function() { this.onChange(); })
        );
    }
}

module.exports = TemplateReferenceEditor;
