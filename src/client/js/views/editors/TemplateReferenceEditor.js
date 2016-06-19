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
        this.value = this.$element.find('select').val();

        this.trigger('change', this.value);
    }
    
    render() {
        let resource = window.resources[this.config.resource || 'templates'];

        // Sanity check for allowed templates
        if(!this.config.allowedTemplates) {
            this.config.allowedTemplates = [];
        }

        // Filter out non-allowed templates
        resource = resource.filter((template) => {
            return this.config.allowedTemplates.indexOf(template) > -1;
        });

        this.$element = _.div({class: 'field-editor template-reference-editor'},
            _.select({class: 'form-control'},
                _.each(resource, (i, template) => {
                    return _.option({
                        value: template
                    }, template);
                })
            ).change(() => { this.onChange(); })
        );

        if(!this.value || resource.indexOf(this.value) < 0) {
            if(resource.length > 0) {
                this.value = resource[0];

                this.$element.find('select').val(this.value);
            
                this.trigger('change', this.value);
            }

        } else {
            this.$element.find('select').val(this.value);
        }
    }
}

module.exports = TemplateReferenceEditor;
