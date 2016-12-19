'use strict';

/**
 * A simple number editor
 */
class NumberEditor extends View {
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
