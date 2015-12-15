'use strict';

let FieldEditor = require('./field');

class TextHtmlEditor extends FieldEditor {
    constructor(args) {
        super(args);

        this.fetch();
    }

    renderField() {
        return _.div({class: 'text-html-editor'}, 
            _.textarea({class: 'form-control'},
                this.model.value
            ).bind('change paste propertychange keyup', this.events.changeTextValue)
        );
    }
}

module.exports = TextHtmlEditor;
