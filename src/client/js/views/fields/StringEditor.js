'use strict';

const FieldEditor = require('./FieldEditor');

/**
 * A simple string editor
 */
class StringEditor extends FieldEditor {
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
                _.if((!this.config.type || this.config.type == 'text') && this.config.multiline,
                    this.$input = _.textarea({class: 'form-control'}, this.value || '')
                        .on('change propertychange paste keyup', function() { editor.onChange(); })
                ),
                _.if((this.config.type && this.config.type != 'text') || !this.config.multiline,
                    this.$input = _.input({class: 'form-control', value: this.value || '', type: this.config.type || 'text'})
                        .on('change propertychange paste keyup', function() { editor.onChange(); })
                )
            )
        );
    }
}

module.exports = StringEditor;
