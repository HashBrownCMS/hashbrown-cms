'use strict';

const FieldEditor = require('./FieldEditor');

/**
 * A simple boolean editor
 */
class BooleanEditor extends FieldEditor {
    constructor(params) {
        super(params);

        this.init();
    }

    render() {
        // Sanity check
        if(typeof this.value === 'undefined') {
            this.value = false;
        
        } else if(typeof this.value === 'string') {
            this.value = this.value == 'true';

        } else if(typeof this.value !== 'boolean') {
            this.value = false

        }

        this.$element = _.div({class: 'field-editor switch-editor'},
            // Render preview
            this.renderPreview(),

            UI.inputSwitch(this.value, (newValue) => {
                this.value = newValue;        
                
                this.trigger('change', this.value);
            })
        );

        // Just to make sure the model has the right type of value
        setTimeout(() => {
            this.trigger('silentchange', this.value);
        }, 20);
    }
}

module.exports = BooleanEditor;
