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
        this.trigger('change', this.$input.val());
    }
    
    render() {
        var editor = this;

        // Main element
        this.$element = _.div({class: 'field-editor string-editor'},
            this.$input = _.input({class: 'form-control', value: this.value})
                .on('change propertychange paste keyup', function() { editor.onChange(); })
        );
    }
}

resources.editors.string = StringEditor;
