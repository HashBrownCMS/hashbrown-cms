'use strict';

/**
 * A simple string editor
 */
class ResourceReferenceEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }

    render() {
        let resource = resources[this.config.resource];
        let value;

        if(resource) {
            value = resource[this.value];

            if(!value) {
                for(let i in resource) {
                    if(resource[i].id == this.value) {
                        value = resource[i];
                        break;
                    }
                }
            }

            if(value) {
                for(let key of (this.config.resourceKeys || [])) {
                    if(value[key]) {
                        value = value[key];
                        break;    
                    }
                }

            }
        }
        
        this.$element = _.div({class: 'field-editor resource-reference-editor'},
            _.p(value || '(none)')
        );
    }
}

module.exports = ResourceReferenceEditor;
