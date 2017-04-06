'use strict';

const FieldEditor = require('./FieldEditor');

/**
 * A simple number editor
 */
class NumberEditor extends FieldEditor {
    constructor(params) {
        super(params);

        this.init();
    }

    /**
     * Event: Change
     */
    onChange() {
        this.value = parseFloat(this.$input.val());

        this.trigger('change', this.value);
    }
    
    render() {
        var editor = this;

        // Main element
        this.$element = _.div({class: 'field-editor string-editor'},
            // Render preview
            this.renderPreview(),

            _.if(this.disabled,
                _.p(this.value || '(none)')
            ),
            _.if(!this.disabled,
                this.$input = _.input({class: 'form-control', value: this.value, type: 'number', step: this.config.step || 'any'})
                    .on('change propertychange paste keyup', function() { editor.onChange(); })
            )
        );
    }
}

module.exports = NumberEditor;
