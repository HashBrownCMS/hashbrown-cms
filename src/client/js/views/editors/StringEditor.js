'use strict';

/**
 * A simple string editor
 */
class StringEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }

    /**
     * Event: Change
     */
    onChange() {
        this.value = this.$input.val();

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
                this.$input = _.input({class: 'form-control', value: this.value, type: this.config.type || 'text'})
                    .on('change propertychange paste keyup', function() { editor.onChange(); })
            )
        );
    }
}

module.exports = StringEditor;
