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

        this.$element = _.div({class: 'field-editor template-reference-editor'},
            _.select({class: 'form-control'},
                _.each(resource, (i, template) => {
                    return _.option({
                        value: template
                    }, template);
                })
            ).change(() => { this.onChange(); })
        );

        if(!this.value) {
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
