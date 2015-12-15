'use strict';

let FieldEditor = require('./field');

class TextEditor extends FieldEditor {
    constructor(args) {
        super(args);

        this.fetch();
    }

    renderField() {
        return _.div({class: 'text-editor'}, 
            _.input({type: 'text', class: 'form-control', value: this.model.value}).bind('change paste propertychange keyup', this.events.changeTextValue)
        );
    }
}

module.exports = TextEditor;
